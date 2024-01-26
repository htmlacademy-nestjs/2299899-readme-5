import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AuthUserErrorMessage, PasswordLength, UsernameLength } from '../authentication.const';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique user\'s email.', example: 'user@user.com' })
  @IsNotEmpty({ message: AuthUserErrorMessage.EmailRequired })
  @IsEmail({}, { message: AuthUserErrorMessage.EmailNotValid })
  email: string;

  @ApiProperty({ description: 'User\'s lastname and firstname.', example: 'John Doe' })
  @IsNotEmpty({ message: AuthUserErrorMessage.UsernameRequired })
  @IsString()
  @MinLength(UsernameLength.Min, { message: AuthUserErrorMessage.UsernameMinLength })
  @MaxLength(UsernameLength.Max, { message: AuthUserErrorMessage.UsernameMaxLength })
  name: string;

  @ApiProperty({ description: 'User\'s password.', example: '123456' })
  @IsNotEmpty({ message: AuthUserErrorMessage.PasswordRequired })
  @IsString()
  @MinLength(PasswordLength.Min, { message: AuthUserErrorMessage.PasswordMinLength })
  @MaxLength(PasswordLength.Max, { message: AuthUserErrorMessage.PasswordMaxLength })
  password: string;
}
