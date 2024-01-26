import {
    CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException
} from '@nestjs/common';

import { CommentService } from '../comment.service';

@Injectable()
export class CommentAuthorGuard implements CanActivate {
  constructor(private readonly commentService: CommentService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const commentId = request.params.id;
    const userId = request.user.userId;
    const existedComment = await this.commentService.getCommentById(commentId);

    if (!existedComment) {
      throw new NotFoundException(`Comment with id "${commentId} not found"`);
    }

    if (existedComment.userId !== userId) {
      throw new ForbiddenException();
    }

    return true;
  }
}
