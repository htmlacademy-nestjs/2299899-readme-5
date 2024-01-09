import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { FileRepository } from './file.repository';
import { SERVE_ROOT } from './uploader.const';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rootPath = configService.get<string>('application.uploadDirectory');
        return [{
          rootPath,
          serveRoot: SERVE_ROOT,
          serveStaticOptions: {
            fallthrough: true,
            etag: true,
          }
         }];
      },
    }),
    MongooseModule.forFeature([
      { name: FileModel.name, schema: FileSchema }
    ]),
  ],
  providers: [UploaderService, FileRepository],
  controllers: [UploaderController],
})
export class UploaderModule {}
