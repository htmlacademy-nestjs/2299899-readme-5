import { Injectable, NotFoundException } from '@nestjs/common';
import { BasePostgresRepository } from '@project/core';
import { PrismaClientService } from '@project/shared-libs/blog/models';
import { PostTag } from '@project/types';

import { TagEntity } from './tag.entity';

@Injectable()
export class TagRepository extends BasePostgresRepository<TagEntity, PostTag> {
  constructor(
    protected readonly client: PrismaClientService,
  ) {
    super(client, TagEntity.fromObject);
  }

  public async save(entity: TagEntity): Promise<TagEntity> {
    const record = await this.client.tag.create({
      data: { ...entity.toPOJO() },
    })

    entity.id = record.id;
    return entity;
  }

  public async findById(id: string): Promise<TagEntity> {
    const document = await this.client.tag.findFirst({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Post tag with id ${id} not found.`);
    }

    return this.createEntityFromDocument(document);
  }

  public async findByTitle(title: string) {
    const document = await this.client.tag.findFirst({
      where: { title },
    });

    return document;
  }

  public async findOneOrCreate(title: string): Promise<TagEntity> {
    const document = await this.findByTitle(title);

    if (!document) {
      return this.save(new TagEntity({ title }));
    }

    return  this.createEntityFromDocument(document);;
  }

  public async findOrCreate(tags: string[]): Promise<TagEntity[]> {
    const promises = Array.from(tags, (title) => this.findOneOrCreate(title));

    return Promise.all(promises);
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.tag.delete({
      where: { id },
    });
  }

  public async update(id: string, entity: TagEntity): Promise<TagEntity> {
    const updatedTag = await this.client.tag.update({
      where: { id },
      data: { title: entity.title },
    });

    return this.createEntityFromDocument(updatedTag);
  }
}
