import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BasePostgresRepository } from '@project/core';
import { PrismaClientService } from '@project/shared-libs/blog/models';
import { Comment, PaginationResult, SortDirection } from '@project/types';

import { CommentEntity } from './comment.entity';
import { CommentQuery } from './query/comment.query';

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
        postId: entity.postId,
      },
    });

    entity.id = record.id;
    return entity;
  }

  public async findById(id: string): Promise<CommentEntity> {
    const record = await this.client.comment.findFirst({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`Comment with id ${id} not found.`);
    }

    return this.createEntityFromDocument(record);
  }

  private async getCommentsCount(where: Prisma.CommentWhereInput): Promise<number> {
    return this.client.comment.count({ where });
  }

  private calculateCommentsPage(totalCount: number, limit: number): number {
    return Math.ceil(totalCount / limit);
  }

  public async findByPostId(postId: string, query?: CommentQuery): Promise<PaginationResult<CommentEntity>> {
    const skip = query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const take = query?.limit;
    const orderBy: Prisma.CommentOrderByWithRelationAndSearchRelevanceInput = {};
    orderBy.createdAt = SortDirection.Desc;

    const [comments, commentsCount] = await Promise.all([
      this.client.comment.findMany({
        where: { postId },
        orderBy,
        skip,
        take,
      }),
      this.getCommentsCount({ postId }),
    ]);

    return {
      entities: comments.map((comment) => this.createEntityFromDocument(comment)),
      currentPage: query?.page,
      totalPages: this.calculateCommentsPage(commentsCount, take),
      itemsPerPage: take,
      totalItems: commentsCount,
    }
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.comment.delete({ where: { id } });
  }
}
