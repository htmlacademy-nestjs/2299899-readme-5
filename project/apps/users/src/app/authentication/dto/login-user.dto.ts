import { IsEmail, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AUTH_USER_EMAIL_NOT_VALID } from '../authentication.const';

export class LoginUserDto {
  @ApiProperty({
    description: 'Unique user\'s email.',
    example: 'user@user.com',
  })
  @IsEmail({}, { message: AUTH_USER_EMAIL_NOT_VALID })
  public email: string;

  @ApiProperty({
    description: 'User\'s password.',
    example: '123456',
  })
  @IsString()
  public password: string;
}
