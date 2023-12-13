import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class UserRdo {
  @ApiProperty({
    description: 'Unique user\'s ID',
    example: '13'
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Unique user\'s email.',
    example: 'user@user.com',
  })
  @Expose()
  public email: string;

  @ApiProperty({
    description: 'User\'s login/username.',
    example: 'keks',
  })
  @Expose()
  public username: string;

  @ApiProperty({
    description: 'User\'s firstname and lastname.',
    example: 'John Doe',
  })
  @Expose()
  public name: string;

  @ApiProperty({
    description: 'User\'s avatar path',
    example: '/images/user.png'
  })
  @Expose()
  public avatar: string;

  @ApiProperty({
    description: 'User\'s date of birth.',
    example: '2002-02-02',
  })
  @Expose()
  public birthDate: string;

  @ApiProperty({
    description: 'User\'s role.',
    example: '2002-02-02',
  })
  @Expose()
  public role: string;

  @ApiProperty({
    description: 'User\'s date of registration.',
    example: '2002-02-02',
  })
  @Expose()
  public registerDate: string;
}
