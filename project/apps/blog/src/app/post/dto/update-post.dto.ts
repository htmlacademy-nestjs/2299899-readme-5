import {
    ArrayMaxSize, ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Matches,
    MaxLength, MinLength, ValidateIf
} from 'class-validator';

import { PostType } from '@project/types';

import {
    TransformArrayLowerCaseNoDiblicates
} from '../decorators/transform-array-lower-case-no-dublicates.decorator';
import {
    CiteAuthorLength, CiteLength, MAX_TAGS_COUNT, PostValidationMessage, TAG_PATTERN, TagLength,
    TextAnonsLength, TextLength, TextTitleLength, URL_DESCRIPTION_MAX_LENGTH, URL_PATTERN,
    VIDEO_URL_PATTERN, VideoTitleLength
} from '../post.const';

export class UpdatePostDto {
  @IsEnum(PostType)
  @IsString()
  @IsNotEmpty()
  public type?: string;

  @MinLength(VideoTitleLength.Min, { message: PostValidationMessage.VideoTitleMinLength })
  @MaxLength(VideoTitleLength.Max, { message: PostValidationMessage.VideoTitleMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Video)
  public videoTitle?: string;

  @Matches(VIDEO_URL_PATTERN, { message: PostValidationMessage.VideoUrlPattern })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Video)
  public videoUrl?: string;

  @MinLength(TextTitleLength.Min, { message: PostValidationMessage.TextTitleMinLength })
  @MaxLength(TextTitleLength.Max, { message: PostValidationMessage.TextTitleMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Text)
  public textTitle?: string;

  @MinLength(TextAnonsLength.Min, { message: PostValidationMessage.TextAnonsMinLength })
  @MaxLength(TextAnonsLength.Max, { message: PostValidationMessage.TextAnonsMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Text)
  public textAnons?: string;

  @MinLength(TextLength.Min, { message: PostValidationMessage.TextMinLength })
  @MaxLength(TextLength.Max, { message: PostValidationMessage.TextMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Text)
  public text?: string;

  @MinLength(CiteLength.Min, { message: PostValidationMessage.CiteMinLength })
  @MaxLength(CiteLength.Max, { message: PostValidationMessage.CiteMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Cite)
  public cite?: string;

  @MinLength(CiteAuthorLength.Min, { message: PostValidationMessage.CiteAuthorMinLength })
  @MaxLength(CiteAuthorLength.Max, { message: PostValidationMessage.CiteAuthorMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Cite)
  public citeAuthor?: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Photo)
  public photo?: string;

  @Matches(URL_PATTERN, { message: PostValidationMessage.UrlInvalid })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Url)
  public url?: string;

  @MaxLength(URL_DESCRIPTION_MAX_LENGTH, { message: PostValidationMessage.UrlDescriptionMaxLength })
  @IsString()
  @IsOptional()
  @ValidateIf((body) => body.type === PostType.Url)
  public urlDescription?: string;

  @MinLength(TagLength.Min, { each: true, message: PostValidationMessage.TagsMinLength })
  @MaxLength(TagLength.Max, { each: true, message: PostValidationMessage.TagsMaxLength })
  @Matches(TAG_PATTERN, { each: true, message: PostValidationMessage.TagsPattern })
  @ArrayMaxSize(MAX_TAGS_COUNT, { message: PostValidationMessage.TagsCountMax })
  @TransformArrayLowerCaseNoDiblicates()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  public tags?: string[];
}
