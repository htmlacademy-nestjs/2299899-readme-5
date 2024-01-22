import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENV_FILE_PATH } from '../const';
import blogConfig from './blog.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [blogConfig],
      envFilePath: ENV_FILE_PATH,
    }),
  ]
})
export class BlogConfigModule {}
