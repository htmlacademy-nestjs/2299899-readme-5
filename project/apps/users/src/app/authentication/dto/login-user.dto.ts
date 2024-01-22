import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AuthUserErrorMessage, PasswordLength } from '../authentication.const';

export class LoginUserDto {
  @ApiProperty({
    description: 'Unique user\'s email.',
    example: 'user@user.com',
  })
  @IsNotEmpty({ message: AuthUserErrorMessage.EmailRequired })
  @IsEmail({}, { message: AuthUserErrorMessage.EmailNotValid })
  public email: string;

  @ApiProperty({
    description: 'User\'s password.',
    example: '123456',
  })
  @IsNotEmpty({ message: AuthUserErrorMessage.PasswordRequired })
  @IsString()
  @MinLength(PasswordLength.Min, { message: AuthUserErrorMessage.PasswordMinLength })
  @MaxLength(PasswordLength.Max, { message: AuthUserErrorMessage.PasswordMaxLength })
  public password: string;
}
