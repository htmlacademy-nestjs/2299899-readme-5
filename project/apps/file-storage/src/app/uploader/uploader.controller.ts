import 'multer';

import { Express } from 'express';

import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MongoIdValidationPipe } from '@project/core';
import { fillDto } from '@project/helpers';

import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import { UploaderService } from './uploader.service';

@Controller('files')
export class UploaderController {
  constructor(
    private readonly uploaderService: UploaderService,
  ) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileEntity = await this.uploaderService.saveFile(file);
    return fillDto(UploadedFileRdo, fileEntity.toPOJO());
  }

  @Get(':fileId')
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string) {
    const existFile = await this.uploaderService.getFile(fileId);
    return fillDto(UploadedFileRdo, existFile);
  }
}
