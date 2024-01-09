import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    FileStorageConfigModule, getMongooseOptions
} from '@project/shared-libs/config/file-storage';

import { UploaderModule } from './uploader/uploader.module';

@Module({
  imports: [
    UploaderModule,
    FileStorageConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
