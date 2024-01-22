import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENV_FILE_PATH } from '../const';
import fileStorageConfig from './file-storage.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [fileStorageConfig],
      envFilePath: ENV_FILE_PATH,
    }),
  ]
})
export class FileStorageConfigModule {}
