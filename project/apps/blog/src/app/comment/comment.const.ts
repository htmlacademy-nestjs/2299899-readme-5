import { SortDirection } from '@project/types';

export const MAX_COMMENTS_COUNT = 50;
export const DEFAULT_PAGE_COUNT = 1;
export const DEFAULT_SORT_DIRECTION = SortDirection.Desc;

export enum CommentLength {
  Min = 10,
  Max = 300,
}

export enum CommentValidationMessage {
  CommentMinLength = `Comment min length is ${CommentLength.Min} symbols`,
  CommentMaxLength = `Comment max length is ${CommentLength.Max} symbols`,
}
