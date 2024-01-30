import { Transform } from 'class-transformer';
import {
    IsBoolean, IsEnum, IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Matches,
    MaxLength, MinLength
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PostStatus, PostType, SortDirection, SortOption } from '@project/types';

import {
    DEFAULT_PAGE_COUNT, DEFAULT_POST_COUNT_LIMIT, DEFAULT_SORT_DIRECTION, PostValidationMessage,
    TAG_PATTERN, TagLength
} from '../post.const';

export class PostQuery {
  @ApiProperty({ description: 'Change limit pagination elements count', example: 25, required: false })
  @Transform(({ value }) => +value || DEFAULT_POST_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  public limit = DEFAULT_POST_COUNT_LIMIT;

  @ApiProperty({ description: 'Post type', example: PostType.Photo, required: false, enum: PostType })
  @IsEnum(PostType)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public type?: string;

  @ApiProperty({ description: 'Post status', example: PostStatus.Published, required: false, enum: PostStatus })
  @IsEnum(PostStatus)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public status?: string;

  @ApiProperty({ description: 'Post author id', example: '65b2e759b06a0d028d76b87a', required: false })
  @IsMongoId()
  @IsOptional()
  public userId?: string;

  @ApiProperty({ description: 'One tag', example: 'tag_1', required: false })
  @MinLength(TagLength.Min, { each: true, message: PostValidationMessage.TagsMinLength })
  @MaxLength(TagLength.Max, { each: true, message: PostValidationMessage.TagsMaxLength })
  @Matches(TAG_PATTERN, { each: true, message: PostValidationMessage.TagsPattern })
  @Transform(({ value }) => (value as string).toLowerCase())
  @IsString()
  @IsOptional()
  public tag?: string;

  @ApiProperty({ description: 'Repost pointer', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  public isRepost?: boolean;

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
