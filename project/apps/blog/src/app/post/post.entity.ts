import { Entity } from '@project/core';
import { Comment, Post, PostType } from '@project/types';

import { PostTypeEntity } from '../post-type/post-type.entity';
import { CreatePostDto } from './dto/create-post.dto';

export class PostEntity implements Post, Entity<string, Post> {
  public id: string;
  public type: PostTypeEntity[];
  public title: string;
  public url: string;
  public photo: string;
  public anons: string;
  public content: string;
  public tags: string[];
  public userId: string;
  public comments: Comment[];

  public populate(data: Post): PostEntity {
    this.id = data.id ?? undefined;
    this.type = data.type.map((type) => PostTypeEntity.fromObject(type));
    this.title = data.title;
    this.url = data.url;
    this.photo = data.url;
    this.anons = data.anons;
    this.content = data.content;
    this.tags = data.tags;
    this.userId = data.userId;
    this.comments = [];

    return this;
  }

  public toPojo(): Post {
    return {
      id: this.id,
      type: this.type.map((postTypeEntity) => postTypeEntity.toPOJO()),
      title: this.title,
      url: this.url,
      photo: this.photo,
      anons: this.anons,
      content: this.content,
      tags: this.tags,
      userId: this.userId,
      comments: this.comments,
    }
  }

  static fromObject(data: Post): PostEntity {
    return new PostEntity().populate(data);
  }

  static fromDto(dto: CreatePostDto, postTypes: PostTypeEntity[]): PostEntity {
    const entity = new PostEntity();
    entity.type = postTypes;
    entity.title = dto.title;
    entity.url = dto.url;
    entity.photo = dto.photo;
    entity.anons = dto.anons;
    entity.content = dto.content;
    entity.tags = dto.tags;
    entity.userId = dto.userId;
    entity.comments = dto.comments;

    return entity;
  }
}
