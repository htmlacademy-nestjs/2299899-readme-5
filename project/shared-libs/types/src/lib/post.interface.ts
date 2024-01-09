import { Comment } from './comment.interface';
import { PostType } from './post-type.interface';

export interface Post {
  id?: string;
  type: PostType;
  title: string;
  url: string;
  photo: string;
  anons: string;
  content: string;
  userId: string;
  tags: string[];
  comments: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
}
