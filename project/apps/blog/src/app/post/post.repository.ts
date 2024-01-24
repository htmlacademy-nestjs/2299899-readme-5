import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BasePostgresRepository } from '@project/core';
import { PrismaClientService } from '@project/shared-libs/blog/models';
import { PaginationResult, Post, PostStatus, PostType, SortOption } from '@project/types';

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
    const pojoEntity = entity.toPOJO();
    const record = await this.client.post.create({
      data: {
        ...pojoEntity,
        publishDate: new Date(),
        tags: { connect: pojoEntity.tags.map((tag) => ({ id: tag.id })) },
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
        tags: true,
        comments: true,
      }
    });

    if (!document) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    if (!Object.values(PostType).includes(document.type as PostType)) {
      throw new ConflictException(`Wrong post type "${document.type}"`)
    }

    return this.createEntityFromDocument(document);
  }

  public async update(id: string, entity: PostEntity): Promise<PostEntity> {
    const pojoEntity = entity.toPOJO();
    const updatedPost = await this.client.post.update({
      where: { id },
      data: {
        type: pojoEntity.type as PostType,
        videoTitle: pojoEntity.videoTitle,
        videoUrl: pojoEntity.videoUrl,
        textTitle: pojoEntity.textTitle,
        textAnons: pojoEntity.textAnons,
        text: pojoEntity.text,
        cite: pojoEntity.cite,
        citeAuthor: pojoEntity.citeAuthor,
        photo: pojoEntity.photo,
        url: pojoEntity.url,
        urlDescription: pojoEntity.urlDescription,
        publishDate: new Date(pojoEntity.publishDate),
        isRepost: pojoEntity.isRepost,
        status: pojoEntity.status,
        repostedUserId: pojoEntity.repostedUserId,
        repostedPostId: pojoEntity.repostedPostId,
      },
      include: { tags: true, comments: true },
    });

    return this.createEntityFromDocument(updatedPost);
  }

  public async find(query?: PostQuery): Promise<PaginationResult<PostEntity>> {
    const skip = query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const take = query?.limit;
    const where: Prisma.PostWhereInput = {};
    const orderBy: Prisma.PostOrderByWithRelationInput = {};

    if (query?.type) {
      where.type = query.type;
    }

    if (query?.userId) {
      where.userId = query.userId;
    }

    if (query?.isRepost) {
      where.isRepost = query?.isRepost;
    }

    if (query.sortOption === SortOption.PublishDate) {
      orderBy.publishDate = query.sortDirection;
    } else if (query.sortOption === SortOption.Likes) {
      orderBy.publishDate = query.sortDirection;
    } else if (query.sortOption === SortOption.Discussed) {
      orderBy.publishDate = query.sortDirection;
    }
    where.status = PostStatus.Published;

    const [records, postCount] = await Promise.all([
      this.client.post.findMany({ where, orderBy, skip, take,
        include: { tags: true, comments: true },
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
