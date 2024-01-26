import {
    ArrayMaxSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength,
    ValidateIf
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@project/types';

import {
    TransformArrayLowerCaseNoDiblicates
} from '../decorators/transform-array-lower-case-no-dublicates.decorator';
import {
    CiteAuthorLength, CiteLength, MAX_TAGS_COUNT, PostValidationMessage, TAG_PATTERN, TagLength,
    TextAnonsLength, TextLength, TextTitleLength, URL_DESCRIPTION_MAX_LENGTH, URL_PATTERN,
    VIDEO_URL_PATTERN, VideoTitleLength
} from '../post.const';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.Photo,
  })
  @IsEnum(PostType)
  @IsString()
  @IsNotEmpty()
  public type: string;

  @ApiProperty({ description: '"Видео" post title', example: "Title" })
  @MinLength(VideoTitleLength.Min, { message: PostValidationMessage.VideoTitleMinLength })
  @MaxLength(VideoTitleLength.Max, { message: PostValidationMessage.VideoTitleMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Video)
  public videoTitle: string;

  @ApiProperty({ description: '"Видео" post url', example: "https://www.youtube.com/watch?v=cwyTleTL06Y" })
  @Matches(VIDEO_URL_PATTERN, { message: PostValidationMessage.VideoUrlPattern })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Video)
  public videoUrl: string;

  @ApiProperty({ description: '"Текст" post title', example: "Title" })
  @MinLength(TextTitleLength.Min, { message: PostValidationMessage.TextTitleMinLength })
  @MaxLength(TextTitleLength.Max, { message: PostValidationMessage.TextTitleMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Text)
  public textTitle: string;

  @ApiProperty({ description: '"Текст" post anounsment', example: "Anounsment" })
  @MinLength(TextAnonsLength.Min, { message: PostValidationMessage.TextAnonsMinLength })
  @MaxLength(TextAnonsLength.Max, { message: PostValidationMessage.TextAnonsMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Text)
  public textAnons: string;

  @ApiProperty({ description: '"Текст" post content', example: "Content" })
  @MinLength(TextLength.Min, { message: PostValidationMessage.TextMinLength })
  @MaxLength(TextLength.Max, { message: PostValidationMessage.TextMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Text)
  public text: string;

  @ApiProperty({ description: '"Цитата" post cite', example: "Cite" })
  @MinLength(CiteLength.Min, { message: PostValidationMessage.CiteMinLength })
  @MaxLength(CiteLength.Max, { message: PostValidationMessage.CiteMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Cite)
  public cite: string;

  @ApiProperty({ description: '"Цитата" post cite author', example: "Statham" })
  @MinLength(CiteAuthorLength.Min, { message: PostValidationMessage.CiteAuthorMinLength })
  @MaxLength(CiteAuthorLength.Max, { message: PostValidationMessage.CiteAuthorMaxLength })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Cite)
  public citeAuthor: string;

  @ApiProperty({ description: '"Фото" post photoId', example: "65b2e759b06a0d028d76b87a" })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Photo)
  public photo: string;

  @ApiProperty({ description: '"Ссылка" post url', example: "https://www.youtube.com/watch?v=cwyTleTL06Y" })
  @Matches(URL_PATTERN, { message: PostValidationMessage.UrlInvalid })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => body.type === PostType.Url)
  public url: string;

  @ApiProperty({ description: '"Ссылка" post url description', example: "Url description" })
  @MaxLength(URL_DESCRIPTION_MAX_LENGTH, { message: PostValidationMessage.UrlDescriptionMaxLength })
  @IsString()
  @IsOptional()
  @ValidateIf((body) => body.type === PostType.Url)
  public urlDescription: string;

  @ApiProperty({ description: 'List of tags', example: ['tag_1', 'ТЕГ_2', 'Стэтхем'], required: false })
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
