import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AuthUserErrorMessage, PasswordLength } from '../authentication.const';

export class ChangeUserPasswordDto {
  @ApiProperty({ description: 'User\'s old password', example: '123456' })
  @IsNotEmpty({ message: AuthUserErrorMessage.PasswordRequired })
  @IsString()
  public currentPassword: string;

  @ApiProperty({ description: 'User\'s new password', example: 'qwerty' })
  @IsNotEmpty({ message: AuthUserErrorMessage.PasswordRequired })
  @IsString()
  @MinLength(PasswordLength.Min, { message: AuthUserErrorMessage.PasswordMinLength })
  @MaxLength(PasswordLength.Max, { message: AuthUserErrorMessage.PasswordMaxLength })
  public newPassword: string;
}
