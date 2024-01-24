import {
    ArrayMaxSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength,
    ValidateIf
} from 'class-validator';

import { PostType } from '@project/types';

import {
    TransformArrayLowerCaseNoDiblicates
} from '../decorators/transform-array-lower-case-no-dublicates.decorator';
import {
    MAX_TAGS_COUNT, PostValidationMessage, TAG_PATTERN, TagLength, VideoTitleLength
} from '../post.const';

export class CreatePostDto {
  @IsEnum(PostType)
  @IsString()
  @IsNotEmpty()
  public type: string;

  @MinLength(VideoTitleLength.Min, { message: PostValidationMessage.VideoTitleMinLength })
  @MaxLength(VideoTitleLength.Max, { message: PostValidationMessage.VideoTitleMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Video)
  public videoTitle: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Video)
  public videoUrl: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Text)
  public textTitle: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Text)
  public textAnons: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Text)
  public text: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Cite)
  public cite: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Cite)
  public citeAuthor: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Photo)
  public photo: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Url)
  public url: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Url)
  public urlDescription: string;

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
