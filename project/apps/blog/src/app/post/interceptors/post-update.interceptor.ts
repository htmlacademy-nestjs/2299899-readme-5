import { Observable } from 'rxjs';

import {
    CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException
} from '@nestjs/common';

import { PostService } from '../post.service';

@Injectable()
export class PostUpdateInterceptor implements NestInterceptor {
  constructor(private readonly postService: PostService) {}

  public async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const postId = context.switchToHttp().getRequest().params.id;
    const existedPost = await this.postService.getPost(postId);

    if (!existedPost) {
      throw new NotFoundException(`Post with id "${postId} not found"`);
    }

    const body = context.switchToHttp().getRequest().body;
    body.type = existedPost.type;

    return next.handle();
  }
}
