import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@project/types';

export class UserRdo {
  @ApiProperty({ description: 'Unique user\'s ID', example: '65aeb270b4b011262dfa6ca5' })
  @Expose()
  public id: string;

  @ApiProperty({ description: 'Unique user\'s email.', example: 'user@user.com' })
  @Expose()
  public email: string;

  @ApiProperty({ description: 'User\'s firstname and lastname.', example: 'John Doe' })
  @Expose()
  public name: string;

  @ApiProperty({ description: 'User\'s avatar id', example: '65aeb270b4b011262dfa6ca6' })
  @Expose()
  public avatar: string;

  @ApiProperty({ description: 'User\'s role.', example: UserRole.User, enum: UserRole })
  @Expose()
  public role: UserRole;

  @ApiProperty({ description: 'User\'s date of registration.', example: new Date().toDateString() })
  @Expose()
  public registerDate: string;

  @ApiProperty({ description: 'User\'s posts number.', example: '1' })
  @Expose()
  public postsCount: string;

  @ApiProperty({ description: 'User\'s subscribers number.', example: '2' })
  @Expose()
  public subscribersCount: string;
}
