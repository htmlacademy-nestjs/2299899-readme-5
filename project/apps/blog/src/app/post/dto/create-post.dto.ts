import {
    ArrayMaxSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength,
    ValidateIf
} from 'class-validator';

import { PostType } from '@project/types';

import { MAX_TAGS_COUNT, PostValidationMessage, VideoTitleLength } from '../post.const';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(PostType)
  public type: string;

  @ValidateIf((body) => body.type === PostType.Video)
  @IsString()
  @IsNotEmpty()
  @MinLength(VideoTitleLength.Min, { message: PostValidationMessage.VideoTitleMinLength })
  @MaxLength(VideoTitleLength.Max, { message: PostValidationMessage.VideoTitleMaxLength })
  public videoTitle: string;

  @ValidateIf((body) => body.type === PostType.Video)
  @IsString()
  @IsNotEmpty()
  public videoUrl: string;

  @ValidateIf((body) => body.type === PostType.Text)
  @IsString()
  @IsNotEmpty()
  public textTitle: string;

  @ValidateIf((body) => body.type === PostType.Text)
  @IsString()
  @IsNotEmpty()
  public textAnons: string;

  @ValidateIf((body) => body.type === PostType.Text)
  @IsString()
  @IsNotEmpty()
  public text: string;

  @ValidateIf((body) => body.type === PostType.Cite)
  @IsString()
  @IsNotEmpty()
  public cite: string;

  @ValidateIf((body) => body.type === PostType.Cite)
  @IsString()
  @IsNotEmpty()
  public citeAuthor: string;

  @ValidateIf((body) => body.type === PostType.Photo)
  @IsString()
  @IsNotEmpty()
  public photo: string;

  @ValidateIf((body) => body.type === PostType.Url)
  @IsString()
  @IsNotEmpty()
  public url: string;

  @ValidateIf((body) => body.type === PostType.Url)
  @IsString()
  @IsNotEmpty()
  public urlDescription: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(MAX_TAGS_COUNT, { message: PostValidationMessage.TagsCountMax })
  public tags?: string[];
}
