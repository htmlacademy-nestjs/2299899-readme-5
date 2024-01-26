import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { CommentLength, CommentValidationMessage } from '../comment.const';

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment', example: "Comment content" })
  @MaxLength(CommentLength.Max, { message: CommentValidationMessage.CommentMaxLength })
  @MinLength(CommentLength.Min, { message: CommentValidationMessage.CommentMinLength })
  @IsString()
  @IsNotEmpty()
  public message: string;
}
