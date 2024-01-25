import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique user\'s email.',
    example: 'user@user.com',
  })
  email: string;

  @ApiProperty({
    description: 'User\'s lastname and firstname.',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User\'s password.',
    example: '123456',
  })
  password: string;
}
