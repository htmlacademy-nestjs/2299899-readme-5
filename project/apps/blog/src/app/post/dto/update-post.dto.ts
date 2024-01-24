import {
    ArrayMaxSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, Matches,
    MaxLength, MinLength
} from 'class-validator';

import {
    TransformArrayLowerCaseNoDiblicates
} from '../decorators/transform-array-lower-case-no-dublicates.decorator';
import { MAX_TAGS_COUNT, PostValidationMessage, TAG_PATTERN, TagLength } from '../post.const';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  public type?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public photo?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public anons?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public content?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public userId?: string;

  @IsUUID('all', { each: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  public comments: string[];

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
