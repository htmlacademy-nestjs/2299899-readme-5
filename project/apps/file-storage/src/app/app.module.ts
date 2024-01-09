import { Module } from '@nestjs/common';
import { FileStorageConfigModule } from '@project/shared-libs/config/file-storage';

import { UploaderModule } from './uploader/uploader.module';

@Module({
  imports: [UploaderModule, FileStorageConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
