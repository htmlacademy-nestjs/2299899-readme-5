import { Injectable } from '@nestjs/common';

import { PostService } from '../post/post.service';
import { CommentEntity } from './comment.entity';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepostiry: CommentRepository,
    private readonly postService: PostService,
  ) {}

  public async getComments(postId: string): Promise<CommentEntity[]> {
    return this.commentRepostiry.findByPostId(postId);
  }

  public async createComment(postId: string, dto: CreateCommentDto): Promise<CommentEntity> {
    const post = await this.postService.getPost(postId);
    const newComment = CommentEntity.fromDto(dto, post.id);
    return this.commentRepostiry.save(newComment);
  }
}
