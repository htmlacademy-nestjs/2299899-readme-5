import { IsEmail, IsISO8601, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AUTH_USER_DATEBIRTH_NOT_VALID, AUTH_USER_EMAIL_NOT_VALID } from '../authentication.const';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique user\'s email.',
    example: 'user@user.com',
  })
  @IsEmail({}, { message: AUTH_USER_EMAIL_NOT_VALID })
  email: string;

  @ApiProperty({
    description: 'User\'s login/username.',
    example: 'keks',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User\'s firstname and lastname.',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User\'s date of birth.',
    example: '2002-02-02',
  })
  @IsISO8601({}, { message: AUTH_USER_DATEBIRTH_NOT_VALID })
  birthDate: string;

  @ApiProperty({
    description: 'User\'s password.',
    example: '123456',
  })
  @IsString()
  password: string;
}
