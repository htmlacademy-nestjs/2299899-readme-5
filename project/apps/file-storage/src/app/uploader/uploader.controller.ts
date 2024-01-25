import 'multer';

import { Express } from 'express';

import {
    Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard, MongoIdValidationPipe } from '@project/core';
import { fillDto } from '@project/helpers';

import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import { UploadTarget } from './uploader.const';
import { UploaderService } from './uploader.service';

@Controller('files')
export class UploaderController {
  constructor(
    private readonly uploaderService: UploaderService,
  ) {}

  @Post('/upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  public async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const fileEntity = await this.uploaderService.saveFile(file, UploadTarget.Avatar);
    return fillDto(UploadedFileRdo, fileEntity.toPOJO());
  }

  @Post('/upload/photo')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  public async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    const fileEntity = await this.uploaderService.saveFile(file, UploadTarget.Photo);
    return fillDto(UploadedFileRdo, fileEntity.toPOJO());
  }

  @Get(':fileId')
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string) {
    const existFile = await this.uploaderService.getFile(fileId);
    return fillDto(UploadedFileRdo, existFile);
  }
}
