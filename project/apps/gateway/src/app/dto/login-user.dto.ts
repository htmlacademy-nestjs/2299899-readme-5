import { IsEmail, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: `User's unique email`,
    example: 'user@user.com',
  })
  @IsEmail({})
  public email: string;

  @ApiProperty({
    description: `User's password`,
    example: '123456',
  })
  @IsString()
  public password: string;
}
