import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationResult } from '@project/types';

import { PostService } from '../post/post.service';
import { CommentEntity } from './comment.entity';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentQuery } from './query/comment.query';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepostiry: CommentRepository,
    private readonly postService: PostService,
  ) {}

  public async getComments(postId: string, query?: CommentQuery): Promise<PaginationResult<CommentEntity>> {
    return this.commentRepostiry.findByPostId(postId, query);
  }

  public async getCommentById(id: string): Promise<CommentEntity> {
    return this.commentRepostiry.findById(id);
  }

  public async createComment(postId: string, userId: string, dto: CreateCommentDto): Promise<CommentEntity> {
    const post = await this.postService.getPost(postId);
    const newComment = CommentEntity.fromDto(dto, post.id, userId);
    return this.commentRepostiry.save(newComment);
  }

  public async deleteComment(id: string) {
    try {
      await this.commentRepostiry.deleteById(id);
    } catch {
      throw new NotFoundException(`Comment with id ${id} not found.`);
    }
  }
}
