import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  public message: string;

  @IsString()
  public userId: string;
}
