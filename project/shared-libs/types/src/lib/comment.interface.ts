import { User } from './user.interface';

export interface Comment {
  id?: string;
  text: string;
  author: User;
  date: Date;
}
