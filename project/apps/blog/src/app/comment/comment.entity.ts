import { Entity } from '@project/core';
import { Comment } from '@project/types';

import { CreateCommentDto } from './dto/create-comment.dto';

export class CommentEntity implements Comment, Entity<string, Comment> {
  public id?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public postId?: string;
  public message: string;
  public userId: string;

  public populate(data: Comment): CommentEntity {
    this.id = data.id ?? undefined;
    this.createdAt = data.createdAt;
    this.message = data.message;
    this.postId = data.postId;
    this.updatedAt = data.updatedAt;
    this.userId = data.userId;

    return this;
  }

  public toPOJO(): Comment {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      postId: this.postId,
      message: this.message,
      userId: this.userId,
    }
  }

  static fromObject(data: Comment): CommentEntity {
    return new CommentEntity().populate(data);
  }

  static fromDto(dto: CreateCommentDto, postId: string, userId: string): CommentEntity {
    return new CommentEntity()
      .populate({
        ...dto,
        postId,
        userId,
      });
  }
}
