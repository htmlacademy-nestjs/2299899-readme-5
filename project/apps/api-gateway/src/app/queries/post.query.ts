import { ApiProperty } from '@nestjs/swagger';
import { PostStatus, PostType, SortDirection, SortOption } from '@project/types';

export class PostQuery {
  @ApiProperty({ description: 'Change limit pagination elements count', example: 25, required: false })
  public limit?: number;

  @ApiProperty({ description: 'Post type', example: PostType.Photo, required: false, enum: PostType })
  public type?: string;

  @ApiProperty({ description: 'Post status', example: PostStatus.Published, required: false, enum: PostStatus })
  public status?: string;

  @ApiProperty({ description: 'Post author id', example: '65b2e759b06a0d028d76b87a', required: false })
  public userId?: string;

  @ApiProperty({ description: 'One tag', example: 'tag_1', required: false })
  public tag?: string;

  @ApiProperty({ description: 'Repost pointer', example: true, required: false })
  public isRepost?: boolean;

  @ApiProperty({ description: 'Sort field option', example: 'Likes', required: false, enum: SortOption })
  public sortOption?: SortOption;

  @ApiProperty({ description: 'Sort direction', example: 'asc', required: false, enum: SortDirection })
  public sortDirection?: SortDirection;

  @ApiProperty({ description: 'Pagination page', example: 2, required: false })
  public page?: number;
}
