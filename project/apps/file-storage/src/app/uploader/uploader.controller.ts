import 'multer';

import { Express } from 'express';

import {
    Controller, Get, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, MongoIdValidationPipe } from '@project/core';
import { fillDto } from '@project/helpers';

import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import {
    API_AUTH_HEADER, FILE_PARAMETER, UploaderApiMessage, UploadTarget
} from './uploader.const';
import { UploaderService } from './uploader.service';

@ApiTags('files')
@Controller('files')
export class UploaderController {
  constructor(
    private readonly uploaderService: UploaderService,
  ) {}

  @ApiHeader(API_AUTH_HEADER)
  @ApiParam(FILE_PARAMETER)
  @ApiResponse({ status: HttpStatus.CREATED, description: UploaderApiMessage.FileUloaded })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: UploaderApiMessage.FileValidationError })
  @Post('/upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  public async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const fileEntity = await this.uploaderService.saveFile(file, UploadTarget.Avatar);
    return fillDto(UploadedFileRdo, fileEntity.toPOJO());
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiParam(FILE_PARAMETER)
  @ApiResponse({ status: HttpStatus.CREATED, description: UploaderApiMessage.FileUloaded })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: UploaderApiMessage.FileValidationError })
  @Post('/upload/photo')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  public async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    const fileEntity = await this.uploaderService.saveFile(file, UploadTarget.Photo);
    return fillDto(UploadedFileRdo, fileEntity.toPOJO());
  }

  @ApiResponse({ status: HttpStatus.OK, description: UploaderApiMessage.FileDataRead })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: UploaderApiMessage.FileNotFound })
  @Get(':fileId')
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string) {
    const existFile = await this.uploaderService.getFile(fileId);
    return fillDto(UploadedFileRdo, existFile);
  }
}
