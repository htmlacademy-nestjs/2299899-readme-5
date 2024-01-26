import dayjs from 'dayjs';

import { Subscriber } from '@project/types';

import { NewsletterDto } from '../dto/newsletter.dto';

export const getNewPosts = ({ posts, id }: NewsletterDto, { notificationDate }: Subscriber) =>
        posts.filter((post) => post.userId !== id && dayjs(post.publishDate).isAfter(notificationDate));
