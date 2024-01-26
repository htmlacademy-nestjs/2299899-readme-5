export class PostQuery {
  public limit: number;
  public type?: string;
  public status?: string;
  public userId?: string;
  public tag?: string;
  public isRepost?: boolean;
  public sortOption: string;
  public sortDirection: string;
  public page: number;
}
