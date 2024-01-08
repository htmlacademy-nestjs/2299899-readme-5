import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostTypeModule } from './post-type/post-type.module';

@Module({
  imports: [PostTypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
