import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseMongoRepository } from '@project/core';

import { FileEntity } from './file.entity';
import { FileModel } from './file.model';

@Injectable()
export class FileRepository extends BaseMongoRepository<FileEntity, FileModel> {
  constructor(
    @InjectModel(FileModel.name) fileModel: Model<FileModel>
  ) {
    super(fileModel, FileEntity.fromObject);
  }
}
