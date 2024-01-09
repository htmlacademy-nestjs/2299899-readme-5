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
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}
