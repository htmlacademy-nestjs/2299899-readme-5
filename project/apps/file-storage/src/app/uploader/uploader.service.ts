import 'multer';

import dayjs from 'dayjs';
import { ensureDir } from 'fs-extra';
import { lookup } from 'mime-types';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { FileStorageConfig } from '@project/shared-libs/config/file-storage';
import { StoredFile } from '@project/types';

import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';
import { ALLOWED_EXTENSIONS, AllowedSize, UploadTarget } from './uploader.const';

@Injectable()
export class UploaderService {
  private readonly DATE_FORMAT = 'YYYY MM';

  constructor(
    @Inject(FileStorageConfig.KEY)
    private readonly config: ConfigType<typeof FileStorageConfig>,
    private readonly fileRepository: FileRepository,
  ) {}

  private getUploadDirectoryPath(): string {
    return this.config.uploadDirectory;
  }

  private getDestinationFilePath(filename: string): string {
    return join(this.getUploadDirectoryPath(), this.getSubUploadDirectoryPath(), filename);
  }

  private getSubUploadDirectoryPath(): string {
    const [year, month] = dayjs().format(this.DATE_FORMAT).split(' ');
    return join(year, month);
  }

  public async writeFile(file: Express.Multer.File, target: UploadTarget): Promise<StoredFile> {
    if (!file) {
      throw new BadRequestException(`Upload file is required`);
    }

    const uploadDirectoryPath = this.getUploadDirectoryPath();
    const subDirectory = this.getSubUploadDirectoryPath();
    const fileExtension = file.originalname.split('.').at(-1);
    const filename = `${randomUUID()}.${fileExtension}`;
    const path = this.getDestinationFilePath(filename);

    if (!fileExtension || lookup(fileExtension) !== file.mimetype || !ALLOWED_EXTENSIONS[target].includes(fileExtension)) {
      throw new BadRequestException(`Extension "${fileExtension}" not allowed`);
    }

    if (file.size > AllowedSize[target]) {
      throw new BadRequestException(`Max file size is ${AllowedSize[target]} bytes`);
    }

    await ensureDir(join(uploadDirectoryPath, subDirectory));
    await writeFile(path, file.buffer);

    return {
      fileExtension: fileExtension || '',
      filename,
      path,
      subDirectory,
    };
  }

  public async saveFile(file: Express.Multer.File, target: UploadTarget): Promise<FileEntity> {
    const storedFile = await this.writeFile(file, target);
    const fileEntity = FileEntity.fromObject({
      hashName: storedFile.filename,
      mimetype: file.mimetype,
      originalName: file.originalname,
      path: storedFile.path,
      size: file.size,
      subDirectory: storedFile.subDirectory,
    });

    return this.fileRepository.save(fileEntity);
  }

  public async getFile(fileId: string): Promise<FileEntity> {
    const existFile = await this.fileRepository.findById(fileId);

    if (! existFile) {
      throw new NotFoundException(`File with ${fileId} not found.`);
    }

    return existFile;
  }
}
