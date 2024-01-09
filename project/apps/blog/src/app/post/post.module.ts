import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/shared-libs/blog/models';

import { PostTypeModule } from '../post-type/post-type.module';
import { PostTypeRepository } from '../post-type/post-type.repository';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [PostTypeModule, PrismaClientModule],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostTypeRepository],
  exports: [PostService],
})
export class PostModule {}
