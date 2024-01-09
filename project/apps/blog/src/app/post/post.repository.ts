import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BasePostgresRepository } from '@project/core';
import { PrismaClientService } from '@project/shared-libs/blog/models';
import { PaginationResult, Post } from '@project/types';

import { PostEntity } from './post.entity';
import { PostQuery } from './query/post.query';

@Injectable()
export class PostRepository extends BasePostgresRepository<PostEntity, Post> {
  constructor(
    protected readonly client: PrismaClientService,
  ) {
    super(client, PostEntity.fromObject);
  }

  private async getPostCount(where: Prisma.PostWhereInput): Promise<number> {
    return this.client.post.count({ where });
  }

  private calculatePostsPage(totalCount: number, limit: number): number {
    return Math.ceil(totalCount / limit);
  }

  public async save(entity: PostEntity): Promise<PostEntity> {
    const pojoEntity = entity.toPojo();
    const record = await this.client.post.create({
      data: {
        ...pojoEntity,
        type: { connect: pojoEntity.type.map(({ id }) => ({ id }))},
        comments: { connect: [] }
      },
    });

    entity.id = record.id;
    return entity;
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.post.delete({
      where: { id },
    });
  }

  public async findById(id: string): Promise<PostEntity> {
    const document = await this.client.post.findFirst({
      where: { id },
      include: {
        type: true,
        comments: true,
      }
    });

    if (!document) throw new NotFoundException(`Post with id ${id} not found.`);

    return this.createEntityFromDocument(document);
  }

  public async update(id: string, entity: PostEntity): Promise<PostEntity> {
    const pojoEntity = entity.toPojo();
    const updatedPost = await this.client.post.update({
      where: { id },
      data: {
        type: pojoEntity.type.map((postType) => ({ id: postType.id })),
        title: pojoEntity.title,
        url: pojoEntity.url,
        photo: pojoEntity.photo,
        anons: pojoEntity.anons,
        content: pojoEntity.content,
        tags: pojoEntity.tags,
      },
      include: { type: true, comments: true },
    });

    return this.createEntityFromDocument(updatedPost);
  }

  public async find(query?: PostQuery): Promsie<PaginationResult<PostEntity>> {
    const skip = query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const take = query?.limit;
    const where: Prisma.PostWhereInput = {};
    const orderBy: Prisma.PostOrderByWithRelationInput = {};

    if (query?.type) where.type = { some: { id: { in: query.type } } };

    if (query?.sortDirection) orderBy.createdAt = query.sortDirection;

    const [records, postCount] = await Promise.all([
      this.client.post.findMany({ where, orderBy, skip, take,
        include: { type: true, comments: true },
      }),
      this.getPostCount(where),
    ])

    return {
      entities: records.map((record) => this.createEntityFromDocument(record)),
      currentPage: query?.page,
      totalPages: this.calculatePostsPage(postCount, take),
      itemsPerPage: take,
      totalItems: postCount,
    }
  }
}
