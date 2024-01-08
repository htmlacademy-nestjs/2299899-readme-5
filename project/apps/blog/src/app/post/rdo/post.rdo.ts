import { Expose, Type } from 'class-transformer';

import { PostTypeRdo } from '../../post-type/rdo/post-type.rdo';

export class PostRdo {
  @Expose()
  public id: string;

  @Expose()
  @Type(() => PostTypeRdo)
  public type: PostTypeRdo[];

  @Expose()
  public title: string;

  @Expose()
  public url: string;

  @Expose()
  public photo: string;

  @Expose()
  public anons: string;

  @Expose()
  public content: string;

  @Expose()
  public tags: string[];

  @Expose()
  public userId: string;

  @Expose()
  public comments: string[];
}
