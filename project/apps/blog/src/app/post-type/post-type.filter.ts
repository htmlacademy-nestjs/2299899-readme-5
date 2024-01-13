import { title } from 'process';

import { Prisma } from '@prisma/client';

export interface PostTypeFilter {
  id?: string;
  title?: string;
}

export function postTypeFilterToPrismaFilter(filter: PostTypeFilter): Prisma.TypeWhereInput | undefined {
  if (!filter) return undefined;

  let prismaFilter = { title: filter.title };

  return prismaFilter;
}
