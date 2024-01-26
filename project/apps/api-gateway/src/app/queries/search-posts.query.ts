import { SortDirection, SortOption } from '@project/types';

export class SearchPostsQuery {
  public limit?: number;
  public title: string;
  public sortOption?: SortOption;
  public sortDirection?: SortDirection;
  public page?: number;
}
