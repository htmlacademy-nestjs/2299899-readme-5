import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { SortDirection } from '@project/types';

import { DEFAULT_PAGE_COUNT, DEFAULT_SORT_DIRECTION, MAX_COMMENTS_COUNT } from '../comment.const';

export class CommentQuery {
  @ApiProperty({ description: 'Change limit pagination elements count', example: 25, required: false })
  @Transform(({ value }) => +value || MAX_COMMENTS_COUNT)
  @IsNumber()
  @IsOptional()
  public limit = MAX_COMMENTS_COUNT;

  @ApiProperty({ description: 'Sort direction', example: 'asc', required: false, enum: SortDirection })
  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

  @ApiProperty({ description: 'Pagination page', example: 2, required: false })
  @Transform(({ value }) => +value || DEFAULT_PAGE_COUNT)
  @IsOptional()
  public page: number = DEFAULT_PAGE_COUNT;
}
