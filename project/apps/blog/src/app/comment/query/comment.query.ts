import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

import { SortDirection } from '@project/types';

import { DEFAULT_PAGE_COUNT, DEFAULT_SORT_DIRECTION, MAX_COMMENTS_COUNT } from '../comment.const';

export class CommentQuery {
  @Transform(({ value }) => +value || MAX_COMMENTS_COUNT)
  @IsNumber()
  @IsOptional()
  public limit = MAX_COMMENTS_COUNT;

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

  @Transform(({ value }) => +value || DEFAULT_PAGE_COUNT)
  @IsOptional()
  public page: number = DEFAULT_PAGE_COUNT;
}
