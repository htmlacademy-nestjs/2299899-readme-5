import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BasePostgresRepository } from '@project/core';

@Injectable()
export class FileRepository extends BasePostgresRepository<FileEntity, FileModel> {
  constructor(
    @InjectModel(FileModel.name) fileModel: Model<FileModel>
  ) {
    super(fileModel, FileEntity.fromObject);
  }
}
