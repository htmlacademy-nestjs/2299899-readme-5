import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

import { SortDirection, SortOption } from '@project/types';

import {
    DEFAULT_PAGE_COUNT, DEFAULT_SEARCH_POSTS_COUNT_LIMIT, DEFAULT_SORT_DIRECTION
} from '../post.const';

export class SearchPostsQuery {
  @Transform(({ value }) => +value || DEFAULT_SEARCH_POSTS_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  public limit = DEFAULT_SEARCH_POSTS_COUNT_LIMIT;

  @Transform(({ value }) => decodeURIComponent(value))
  @IsString()
  public title: string;

  @IsIn(Object.values(SortOption))
  @IsOptional()
  public sortOption: SortOption = SortOption.PublishDate;

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

  @Transform(({ value }) => +value || DEFAULT_PAGE_COUNT)
  @IsOptional()
  public page: number = DEFAULT_PAGE_COUNT;
}
