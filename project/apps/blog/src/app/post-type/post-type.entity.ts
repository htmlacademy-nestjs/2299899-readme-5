import { Entity } from '@project/core';
import { PostType } from '@project/types';

export class PostTypeEntity implements PostType, Entity<string, PostType> {
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
    this.id = data.id ?? undefined;
    this.title = data.title;
    this.createdAt = data.createdAt ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
  }

  public toPOJO(): PostType {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromObject(data: PostType): PostTypeEntity {
    return new PostTypeEntity(data);
  }
}
