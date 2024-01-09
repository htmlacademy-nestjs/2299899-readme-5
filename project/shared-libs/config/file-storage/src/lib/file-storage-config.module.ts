import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const ENV_FILE_PATH = 'apps/file-storage/file-storage.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [],
      envFilePath: ENV_FILE_PATH,
    }),
  ]
})
export class FileStorageConfigModule {}
