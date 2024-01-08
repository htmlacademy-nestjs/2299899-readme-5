import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/shared-libs/blog/models';

import { PostTypeModule } from '../post-type/post-type.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [PostTypeModule, PrismaClientModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
