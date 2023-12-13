import { User } from './user.interface';

export interface Post {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
  photo: string;
  videoLink: string;
  creationData: Date;
  publicationDate: Date;
  author: User;
}
