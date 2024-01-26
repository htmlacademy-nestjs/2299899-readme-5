import { Entity } from '@project/core';
import { PostTag } from '@project/types';

export class TagEntity implements PostTag, Entity<string, PostTag> {
  public id?: string;
  public title: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: PostTag) {
    this.populate(data);
  }

  public populate(data: PostTag): void {
    this.id = data.id ?? undefined;
    this.title = data.title;
    this.createdAt = data.createdAt ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
  }

  public toPOJO(): PostTag {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromObject(data: PostTag): TagEntity {
    return new TagEntity(data);
  }
}
