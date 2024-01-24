import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { CommentLength, CommentValidationMessage } from '../comment.const';

export class CreateCommentDto {
  @MaxLength(CommentLength.Max, { message: CommentValidationMessage.CommentMaxLength })
  @MinLength(CommentLength.Min, { message: CommentValidationMessage.CommentMinLength })
  @IsString()
  @IsNotEmpty()
  public message: string;
}
