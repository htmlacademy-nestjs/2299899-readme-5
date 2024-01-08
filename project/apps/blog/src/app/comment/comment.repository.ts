import { Injectable, NotFoundException } from '@nestjs/common';
import { BasePostgresRepository } from '@project/core';
import { PrismaClientService } from '@project/shared-libs/blog/models';
import { Comment } from '@project/types';

import { MAX_COMMENTS_COUNT } from './comment.const';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentRepository extends BasePostgresRepository<CommentEntity, Comment> {
  constructor(
    protected readonly client: PrismaClientService,
  ) {
    super(client, CommentEntity.fromObject);
  }

  public async save(entity: CommentEntity): Promise<CommentEntity> {
    const record = await this.client.comment.create({
      data: {
        message: entity.message,
        userId: entity.userId,
        postId: entity.userId,
      },
    });

    entity.id = record.id;
    return entity;
  }

  public async findById(id: string): Promise<CommentEntity> {
    const record = await this.client.comment.findFirst({
      where: { id },
      take: MAX_COMMENTS_COUNT,
    });

    if (!record) throw new NotFoundException(`Comment with id ${id} not found.`);

    return this.createEntityFromDocument(record);
  }

  public async findByPostId(postId: string): Promise<CommentEntity[]> {
    const records = await this.client.comment.findMany({
      where: { postId },
    });

    return records.map((record) => this.createEntityFromDocument(record));
  }
}
