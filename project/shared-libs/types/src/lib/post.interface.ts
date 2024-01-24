import { Comment } from './comment.interface';
import { PostTag } from './post-tag.interface';

export interface Post {
  id?: string;
  type: string;
  videoTitle: string;
  videoUrl: string;
  textTitle: string;
  textAnons: string;
  text: string;
  cite: string;
  citeAuthor: string;
  photo: string
  url: string;
  urlDescription: string;
  userId: string;
  tags: PostTag[];
  comments: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
}
