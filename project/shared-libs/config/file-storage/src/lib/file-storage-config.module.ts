import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENV_FILE_PATH } from '../const';
import fileStorageConfig from './file-storage.config';
import jwtConfig from './jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [fileStorageConfig, jwtConfig],
      envFilePath: ENV_FILE_PATH,
    }),
  ]
})
export class FileStorageConfigModule {}
