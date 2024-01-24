import { Entity } from '@project/core';
import { Post, PostStatus, PostType } from '@project/types';

import { CommentEntity } from '../comment/comment.entity';
import { TagEntity } from '../tag/tag.entity';
import { CreatePostDto } from './dto/create-post.dto';

export class PostEntity implements Post, Entity<string, Post> {
  public id?: string;
  public type: string;
  public videoTitle: string;
  public videoUrl: string;
  public textTitle: string;
  public textAnons: string;
  public text: string;
  public cite: string;
  public citeAuthor: string;
  public photo: string
  public url: string;
  public urlDescription: string;
  public tags: TagEntity[];
  public userId: string;
  public comments: CommentEntity[];
  public createdAt?: Date;
  public updatedAt?: Date;
  public publishDate?: Date;
  public isRepost: boolean;
  public status: string;
  public repostedUserId?: string;
  public repostedPostId?: string;

  public populate(data: Post): PostEntity {
    this.id = data.id ?? undefined;
    this.type = data.type;
    this.videoTitle = data.videoTitle ?? undefined;
    this.videoUrl = data.videoUrl ?? undefined;
    this.textTitle = data.textTitle ?? undefined;
    this.textAnons = data.textAnons ?? undefined;
    this.text = data.text ?? undefined;
    this.cite = data.cite ?? undefined;
    this.citeAuthor = data.citeAuthor ?? undefined;
    this.photo = data.photo ?? undefined;
    this.url = data.url ?? undefined;
    this.urlDescription = data.urlDescription ?? undefined;
    this.userId = data.userId;
    this.tags = data.tags.map((tag) => TagEntity.fromObject(tag));
    this.comments = data.comments.map((comment) => CommentEntity.fromObject(comment));;
    this.createdAt = data.createdAt ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.publishDate = data.publishDate ?? undefined;
    this.isRepost = data.isRepost;
    this.status = data.status;
    this.repostedUserId = data.repostedUserId;
    this.repostedPostId = data.repostedPostId;

    return this;
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      type: this.type,
      videoTitle: this.videoTitle,
      videoUrl: this.videoUrl,
      textTitle: this.textTitle,
      textAnons: this.textAnons,
      text: this.text,
      cite: this.cite,
      citeAuthor: this.citeAuthor,
      photo: this.photo,
      url: this.url,
      urlDescription: this.urlDescription,
      userId: this.userId,
      tags: this.tags,
      comments: this.comments.map((entity) => entity.toPOJO()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      publishDate: this.publishDate,
      isRepost: this.isRepost,
      status: this.status,
      repostedUserId: this.repostedUserId,
      repostedPostId: this.repostedPostId,
    }
  }

  static fromObject(data: Post): PostEntity {
    return new PostEntity().populate(data);
  }

  static fromDto(dto: CreatePostDto, userId: string, tags: TagEntity[]): PostEntity {
    const entity = new PostEntity();
    entity.type = dto.type as PostType;
    entity.videoTitle = dto.videoTitle,
    entity.videoUrl = dto.videoUrl,
    entity.textTitle = dto.textTitle,
    entity.textAnons = dto.textAnons,
    entity.text = dto.text,
    entity.cite = dto.cite,
    entity.citeAuthor = dto.citeAuthor,
    entity.photo = dto.photo,
    entity.url = dto.url,
    entity.urlDescription = dto.urlDescription,
    entity.userId = userId,
    entity.tags = tags;
    entity.isRepost = false;
    entity.status = PostStatus.Published;

    return entity;
  }
}
