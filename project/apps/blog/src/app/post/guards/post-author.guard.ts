import {
    CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException
} from '@nestjs/common';

import { PostService } from '../post.service';

@Injectable()
export class PostAuthorGuard implements CanActivate {
  constructor(private readonly postService: PostService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postId = request.params.id;
    const userId = request.user.userId;
    const existedPost = await this.postService.getPost(postId);

    if (!existedPost) {
      throw new NotFoundException(`Post with id "${postId} not found"`);
    }

    if (existedPost.userId !== userId) {
      throw new ForbiddenException();
    }

    return true;
  }
}
