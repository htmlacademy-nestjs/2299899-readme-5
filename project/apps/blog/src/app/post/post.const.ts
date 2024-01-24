import { SortDirection } from '@project/types';

export const DEFAULT_POST_COUNT_LIMIT = 25;
export const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
export const DEFAULT_PAGE_COUNT = 1;

export enum PostValidationMessage {
  VideoTitleMinLength = 'Video title min length is 20 symbols',
  VideoTitleMaxLength = 'Video title max length is 50 symbols',

  TagsCountMax = 'Max tags number is 8',
}

export enum VideoTitleLength {
  Min = 20,
  Max = 50,
}

export const MAX_TAGS_COUNT = 8;
