import { SortDirection } from '@project/types';

export const DEFAULT_POST_COUNT_LIMIT = 25;
export const DEFAULT_SEARCH_POSTS_COUNT_LIMIT = 20;
export const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
export const DEFAULT_PAGE_COUNT = 1;

export enum VideoTitleLength {
  Min = 20,
  Max = 50,
}
export const VIDEO_URL_PATTERN = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

export enum TextTitleLength {
  Min = 20,
  Max = 50,
}
export enum TextAnonsLength {
  Min = 50,
  Max = 255,
}
export enum TextLength {
  Min = 100,
  Max = 1024,
}

export enum CiteLength {
  Min = 20,
  Max = 300,
}
export enum CiteAuthorLength {
  Min = 3,
  Max = 50,
}

export const URL_PATTERN = /^(ftp|http|https):\/\/[^ "]+$/;
export const URL_DESCRIPTION_MAX_LENGTH = 300;

export const MAX_TAGS_COUNT = 8;
export const TAG_PATTERN = /^[\p{L}]+[\p{L}\p{N}\p{P}]*$/umg;
export enum TagLength {
  Min = 3,
  Max = 10,
}

export enum PostValidationMessage {
  VideoTitleMinLength = `Video post title min length is ${VideoTitleLength.Min} symbols`,
  VideoTitleMaxLength = `Video post title max length is ${VideoTitleLength.Max} symbols`,
  VideoUrlPattern = `Video post url must be a valid YouTube link`,

  TextTitleMinLength = `Text post title min length is ${TextTitleLength.Min} symbols`,
  TextTitleMaxLength = `Text post title max length is ${TextTitleLength.Max} symbols`,
  TextAnonsMinLength = `Text post anons min length is ${TextAnonsLength.Min} symbols`,
  TextAnonsMaxLength = `Text post anons max length is ${TextAnonsLength.Max} symbols`,
  TextMinLength = `Text post text content min length is ${TextLength.Min} symbols`,
  TextMaxLength = `Text post text content max length is ${TextLength.Max} symbols`,

  CiteMinLength = `Cite post cite content min length is ${CiteLength.Min} symbols`,
  CiteMaxLength = `Cite post cite content max length is ${CiteLength.Max} symbols`,
  CiteAuthorMinLength = `Cite post author min length is ${CiteAuthorLength.Min} symbols`,
  CiteAuthorMaxLength = `Cite post author max length is ${CiteAuthorLength.Max} symbols`,

  UrlInvalid = `Invalid url`,
  UrlDescriptionMaxLength = `Url post description max length is ${URL_DESCRIPTION_MAX_LENGTH} symbols`,

  TagsCountMax = `Max tags number is ${MAX_TAGS_COUNT}`,
  TagsPattern = 'Each tag must be a single word, start with a letter',
  TagsMinLength = `Each tag min length is ${TagLength.Min} symbols`,
  TagsMaxLength = `Each tag max length is ${TagLength.Max} symbols`,
}

export enum PostsApiMessage {
  PostsReadAll = 'List of posts',
  Unauthorized = 'Required jwt token authorization',
  PostCreated = 'New post created',
  ValidationFailed = 'Bad request, failed request validation',
  PostRead = 'Single post',
  PostNotFound = 'Post with provided id not found',
  PostUpdate = 'Post updated successfully',
  PostDelete = 'Post deleted',
  PostAuthorForbidden = 'Forbidden, post doesn\'t belong to the user',
  PostNotAuthorForbidden = 'Forbidden, post belongs to the user',
  PostLikeForbidden = 'Forbidden, likes aren\'t allowed for posts with status "Черновик"',
}
