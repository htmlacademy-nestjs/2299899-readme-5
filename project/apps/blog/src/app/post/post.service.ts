import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationResult } from '@project/types';

import { PostTypeRepository } from '../post-type/post-type.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './post.entity';
import { PostRepository } from './post.repository';
import { PostQuery } from './query/post.query';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postTypeRepository: PostTypeRepository,
  ) {}

  public async getAllPosts(query?: PostQuery): Promise<PaginationResult<PostEntity>> {
    return this.postRepository.find(query);
  }

  public async createPost(dto: CreatePostDto): Promise<PostEntity> {
    const postType = await this.postTypeRepository.findById(dto.type);
    const newPost = PostEntity.fromDto(dto, postType);
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
      if (value !== undefined && key !== 'type' && postExists[key] !== value) {
        postExists[key] = value;
        hasChanges = true;
      }

      if (key === 'type' && value) {
        const postTypeId = postExists.type.id;
        const postTypeExists = await this.postTypeRepository.findById(postTypeId);

        if (!postTypeExists) postExists.type = postTypeExists;
      }

      if (isSamePostTypes && !hasChanges) return postExists;

      return this.postRepository.update(id, postExists);
    }
  }
}
