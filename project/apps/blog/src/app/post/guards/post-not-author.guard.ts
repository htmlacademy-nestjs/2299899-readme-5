import {
    CanActivate, ConflictException, ExecutionContext, ForbiddenException, Injectable,
    NotFoundException
} from '@nestjs/common';

import { PostService } from '../post.service';

@Injectable()
export class PostNotAuthorGuard implements CanActivate {
constructor(private readonly postService: PostService) {}

public async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();
  const postId = request.params.id;
  const userId = request.user.userId;
  const existedPost = await this.postService.getPost(postId);

  if (!existedPost) {
    throw new NotFoundException(`Post with id "${postId} not found"`);
  }

  if (existedPost.userId === userId) {
    throw new ConflictException(`User "${userId}" can't repost his own post`);
  }

  return true;
}
}
