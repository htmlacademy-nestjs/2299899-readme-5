import { Module } from '@nestjs/common';
import { BlogConfigModule } from '@project/shared-libs/config/blog';

import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    TagModule,
    PostModule,
    CommentModule,
    BlogConfigModule,
  ],
})
export class AppModule {}
