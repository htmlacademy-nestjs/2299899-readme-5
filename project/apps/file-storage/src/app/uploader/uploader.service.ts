import 'multer';

import dayjs from 'dayjs';
import { ensureDir } from 'fs-extra';
import { extension } from 'mime-types';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { FileStorageConfig } from '@project/shared-libs/config/file-storage';
import { StoredFile } from '@project/types';

import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';

@Injectable()
export class UploaderService {
  private readonly logger = new Logger(UploaderService.name);
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

  public async writeFile(file: Express.Multer.File): Promise<StoredFile> {
    try {
      const uploadDirectoryPath = this.getUploadDirectoryPath();
      const subDirectory = this.getSubUploadDirectoryPath();
      const fileExtension = extension(file.mimetype);
      const filename = `${randomUUID()}.${fileExtension}`;
      const path = this.getDestinationFilePath(filename);

      await ensureDir(join(uploadDirectoryPath, subDirectory));
      await writeFile(path, file.buffer);

      return {
        fileExtension,
        filename,
        path,
        subDirectory,
      };
    } catch (error) {
      this.logger.error(`Error while saving file: ${error.message}`);
      throw new Error(`Can't save file`);
    }
  }

  public async saveFile(file: Express.Multer.File): Promise<string> {
    const storedFile = await this.writeFile(file);
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
