import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/shared-libs/blog/models';

import { PostModule } from '../post/post.module';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports: [PostModule, PrismaClientModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
