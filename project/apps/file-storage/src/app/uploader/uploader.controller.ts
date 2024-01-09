import 'multer';

import { Express } from 'express';

import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploaderService } from './uploader.service';

@Controller('files')
export class UploaderController {
  constructor(
    private readonly uploaderService: UploaderService,
  ) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploaderService.saveFile(file);
  }
}
