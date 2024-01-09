import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { PostTypeModule } from './post-type/post-type.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [PostTypeModule, PostModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
