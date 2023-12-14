import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique user\'s email.',
    example: 'user@user.com',
  })
  email: string;

  @ApiProperty({
    description: 'User\'s login/username.',
    example: 'keks',
  })
  username: string;

  @ApiProperty({
    description: 'User\'s firstname and lastname.',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User\'s date of birth.',
    example: '2002-02-02',
  })
  birthDate: string;

  @ApiProperty({
    description: 'User\'s password.',
    example: '123456',
  })
  password: string;
}
