import { SortDirection } from '@project/types';

export const DEFAULT_POST_COUNT_LIMIT = 25;
export const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
export const DEFAULT_PAGE_COUNT = 1;

export enum VideoTitleLength {
  Min = 20,
  Max = 50,
}

export const MAX_TAGS_COUNT = 8;
export const TAG_PATTERN = /^[\p{L}]+[\p{L}\p{N}\p{P}]*$/umg;

export enum TagLength {
  Min = 3,
  Max = 10,
}

export enum PostValidationMessage {
  VideoTitleMinLength = `Video title min length is ${VideoTitleLength.Min} symbols`,
  VideoTitleMaxLength = `Video title max length is ${VideoTitleLength.Max} symbols`,

  TagsCountMax = `Max tags number is ${MAX_TAGS_COUNT}`,
  TagsPattern = 'Each tag must be a single word, start with a letter',
  TagsMinLength = `Each tag min length is ${TagLength.Min} symbols`,
  TagsMaxLength = `Each tag max length is ${TagLength.Max} symbols`,
}
