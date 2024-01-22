import { Module } from '@nestjs/common';
import { BlogConfigModule } from '@project/shared-libs/config/blog';

import { CommentModule } from './comment/comment.module';
import { PostTypeModule } from './post-type/post-type.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    PostTypeModule,
    PostModule,
    CommentModule,
    BlogConfigModule,
  ],
})
export class AppModule {}
