import { Expose } from 'class-transformer';

export class PostTypeRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;
}
