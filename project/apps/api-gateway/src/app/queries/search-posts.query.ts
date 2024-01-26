import { ApiProperty } from '@nestjs/swagger';
import { SortDirection, SortOption } from '@project/types';

export class SearchPostsQuery {
  @ApiProperty({ description: 'Change limit pagination elements count', example: 25, required: false })
  public limit?: number;

  @ApiProperty({ description: 'Search words in post title', example: 'video text' })
  public title: string;

  @ApiProperty({ description: 'Sort field option', example: 'Likes', required: false, enum: SortOption })
  public sortOption?: SortOption;

  @ApiProperty({ description: 'Sort direction', example: 'asc', required: false, enum: SortDirection })
  public sortDirection?: SortDirection;

  @ApiProperty({ description: 'Pagination page', example: 2, required: false })
  public page?: number;
}
