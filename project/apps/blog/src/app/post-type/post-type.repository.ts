import { Injectable, NotFoundException } from '@nestjs/common';
import { BasePostgresRepository } from '@project/core';
import { PrismaClientService } from '@project/shared-libs/blog/models';
import { PostType } from '@project/types';

import { MAX_POST_TYPE_LIMIT } from './post-type.const';
import { PostTypeEntity } from './post-type.entity';
import { PostTypeFilter, postTypeFilterToPrismaFilter } from './post-type.filter';

@Injectable()
export class PostTypeRepository extends BasePostgresRepository<PostTypeEntity, PostType> {
  constructor(
    protected readonly client: PrismaClientService,
  ) {
    super(client, PostTypeEntity.fromObject);
  }

  public async save(entity: PostTypeEntity): Promise<PostTypeEntity> {
    const record = await this.client.type.create({
      data: { ...entity.toPOJO() },
    })

    entity.id = record.id;
    return entity;
  }

  public async findById(id: string): Promise<PostTypeEntity> {
    const document = await this.client.type.findFirst({
      where: {id},
    });

    if (!document) throw new NotFoundException(`Post type with id ${id} not found.`);

    return this.createEntityFromDocument(document);
  }

  public async find(filter?: PostTypeFilter): Promise<PostTypeEntity[]> {
    const where = filter ?? postTypeFilterToPrismaFilter(filter);

    const documents = await this.client.type.findMany({
      where,
      take: MAX_POST_TYPE_LIMIT,
    });

    return documents.map((document) => this.createEntityFromDocument(document));
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.type.delete({
      where: { id },
    });
  }

  public async update(id: string, entity: PostTypeEntity): Promise<PostTypeEntity> {
    const updatedPostType = await this.client.type.update({
      where: { id },
      data: { title: entity.title },
    });

    return this.createEntityFromDocument(updatedPostType);
  }
}
