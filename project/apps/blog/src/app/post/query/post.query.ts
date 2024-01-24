import { Transform } from 'class-transformer';
import {
    IsArray, IsBoolean, IsEnum, IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID
} from 'class-validator';

import { PostType, SortDirection, SortOption } from '@project/types';

import {
    DEFAULT_PAGE_COUNT, DEFAULT_POST_COUNT_LIMIT, DEFAULT_SORT_DIRECTION
} from '../post.const';

export class PostQuery {
  @Transform(({ value }) => +value || DEFAULT_POST_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  public limit = DEFAULT_POST_COUNT_LIMIT;

  @IsEnum(PostType)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public type?: string;

  @IsOptional()
  public status?: string;

  @IsMongoId()
  @IsOptional()
  public userId?: string;

  @IsBoolean()
  @IsOptional()
  public isRepost?: boolean;

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
