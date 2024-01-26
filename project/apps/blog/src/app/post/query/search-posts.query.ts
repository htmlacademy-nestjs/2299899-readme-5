import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { SortDirection, SortOption } from '@project/types';

import {
    DEFAULT_PAGE_COUNT, DEFAULT_SEARCH_POSTS_COUNT_LIMIT, DEFAULT_SORT_DIRECTION
} from '../post.const';

export class SearchPostsQuery {
  @ApiProperty({ description: 'Change limit pagination elements count', example: 25, required: false })
  @Transform(({ value }) => +value || DEFAULT_SEARCH_POSTS_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  public limit = DEFAULT_SEARCH_POSTS_COUNT_LIMIT;

  @ApiProperty({ description: 'Search words in post title', example: 'video text' })
  @Transform(({ value }) => decodeURIComponent(value))
  @IsString()
  public title: string;

  @ApiProperty({ description: 'Sort field option', example: 'Likes', required: false, enum: SortOption })
  @IsIn(Object.values(SortOption))
  @IsOptional()
  public sortOption: SortOption = SortOption.PublishDate;

  @ApiProperty({ description: 'Sort direction', example: 'asc', required: false, enum: SortDirection })
  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

  @ApiProperty({ description: 'Pagination page', example: 2, required: false })
  @Transform(({ value }) => +value || DEFAULT_PAGE_COUNT)
  @IsOptional()
  public page: number = DEFAULT_PAGE_COUNT;
}
