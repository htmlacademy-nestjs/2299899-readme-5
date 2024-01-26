import { Module } from '@nestjs/common';
import { JwtAccessStrategy } from '@project/core';
import { PrismaClientModule } from '@project/shared-libs/blog/models';

import { NotificationsModule } from '../notifications/notifications.module';
import { TagModule } from '../tag/tag.module';
import { TagRepository } from '../tag/tag.repository';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [
    TagModule,
    PrismaClientModule,
    NotificationsModule,
  ],
  controllers: [
    PostController,
  ],
  providers: [
    PostService,
    PostRepository,
    TagRepository,
    JwtAccessStrategy,
  ],
  exports: [
    PostService,
  ],
})
export class PostModule {}
