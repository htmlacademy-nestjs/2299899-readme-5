import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationResult, PostStatus } from '@project/types';

import { TagRepository } from '../tag/tag.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './post.entity';
import { PostRepository } from './post.repository';
import { PostQuery } from './query/post.query';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  public async getAllPosts(query?: PostQuery): Promise<PaginationResult<PostEntity>> {
    query.status = PostStatus.Published;
    return this.postRepository.find(query);
  }

  public async createPost(dto: CreatePostDto, userId: string): Promise<PostEntity> {
    const tags = await this.tagRepository.findOrCreate(dto.tags ?? []);
    const newPost = PostEntity.fromDto(dto, userId, tags);
    await this.postRepository.save(newPost);

    return newPost;
  }

  public async deletePost(id: string): Promise<void> {
    try {
      await this.postRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }
  }

  public async getPost(id: string): Promise<PostEntity> {
    return this.postRepository.findById(id);
  }

  public async updatePost(id: string, dto: UpdatePostDto): Promise<PostEntity> {
    const postExists = await this.postRepository.findById(id);
    let isSamePostTypes = true;
    let hasChanges = false;

    for (const [key, value] of Object.entries(dto)) {

      if (value !== undefined && postExists[key] !== value) {
        postExists[key] = value;
        hasChanges = true;
      }

      if (key === 'publishDate') {
        postExists[key] = new Date(value);
        hasChanges = true;
      }
    }

    if (isSamePostTypes && !hasChanges) {
      return postExists;
    }

    return this.postRepository.update(id, postExists);
  }

  public async repostPost(id: string, userId: string): Promise<PostEntity> {
    const existedPost = await this.postRepository.findById(id);
    const query = new PostQuery();
    query.isRepost = true;
    query.userId = userId;
    const userReposts = await this.postRepository.find(query);

    if (userReposts.entities.find((repost) => repost.repostedPostId)) {
      throw new ConflictException(`Post "${id}" is already reposted by user "${userId}"`);
    }

    existedPost.repostedPostId = existedPost.id;
    existedPost.repostedUserId = existedPost.userId;
    existedPost.userId = userId;
    existedPost.id = undefined;
    existedPost.isRepost = true;
    existedPost.publishDate = undefined;
    existedPost.createdAt = undefined;
    existedPost.updatedAt = undefined;

    return await this.postRepository.save(existedPost);
  }

  public async getAllDrafts(query?: PostQuery, userId?: string): Promise<PaginationResult<PostEntity>> {
    query.status = PostStatus.Draft;
    query.userId = userId;
    return this.postRepository.find(query);
  }
}
