import { Entity } from '@project/core';
import { Comment, Post } from '@project/types';

import { PostTypeEntity } from '../post-type/post-type.entity';
import { CreatePostDto } from './dto/create-post.dto';

export class PostEntity implements Post, Entity<string, Post> {
  public id?: string;
  public type: PostTypeEntity;
  public title: string;
  public url: string;
  public photo: string;
  public anons: string;
  public content: string;
  public tags: string[];
  public userId: string;
  public comments: Comment[];
  public createdAt?: Date;
  public updatedAt?: Date;

  public populate(data: Post): PostEntity {
    this.id = data.id ?? undefined;
    this.title = data.title;
    this.type = new PostTypeEntity(data.type);
    this.url = data.url;
    this.photo = data.url;
    this.anons = data.anons;
    this.content = data.content;
    this.tags = data.tags;
    this.userId = data.userId;
    this.comments = [];
    this.createdAt = data.createdAt ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;

    return this;
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      url: this.url,
      photo: this.photo,
      anons: this.anons,
      content: this.content,
      userId: this.userId,
      tags: this.tags,
      comments: this.comments,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromObject(data: Post): PostEntity {
    return new PostEntity().populate(data);
  }

  static fromDto(dto: CreatePostDto): PostEntity {
    const entity = new PostEntity();
    entity.type = new PostTypeEntity({ title: dto.type});
    entity.title = dto.title;
    entity.url = dto.url;
    entity.photo = dto.photo;
    entity.anons = dto.anons;
    entity.content = dto.content;
    entity.tags = dto.tags;
    entity.userId = dto.userId;

    return entity;
  }
}
