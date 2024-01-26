import { Post } from '@project/types';

export class SendNewsletterDto {
  public id: string;
  public email: string;
  public posts: Post[];
}
