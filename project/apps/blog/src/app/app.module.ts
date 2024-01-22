import { Module } from '@nestjs/common';

import { CommentModule } from './comment/comment.module';
import { PostTypeModule } from './post-type/post-type.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    PostTypeModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}
