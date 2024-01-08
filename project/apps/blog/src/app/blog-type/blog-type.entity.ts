import { Entity } from '@project/core';
import { PostType } from '@project/types';

export class BlogTypeEntity implements PostType, Entity<string> {
  public id?: string;
  public title: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: PostType) {
    if (!data.title) {
      throw new Error('PostType is required');
    }

    this.populate(data);
  }

  public populate(data: PostType): void {
    this.id = data.id ?? '';
    this.title = data.title;
    this.createdAt = data.createdAt ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
  }

  public toPOJO(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
