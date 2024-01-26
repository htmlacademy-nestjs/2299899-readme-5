import { IsArray, IsEmail, IsString } from 'class-validator';

import { Post } from '@project/types';

export class NewsletterDto {
  @IsString()
  public id: string;

  @IsEmail()
  public email: string;

  @IsArray()
  public posts: Post[];
}
