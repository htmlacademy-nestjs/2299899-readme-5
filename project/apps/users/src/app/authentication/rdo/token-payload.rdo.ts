import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@project/types';

export class TokenPayloadRdo {
  @ApiProperty({ description: 'Unique user\'s ID', example: '65aeb270b4b011262dfa6ca6' })
  @Expose()
  public userId: string;

  @ApiProperty({ description: 'Unique user\'s email.', example: 'user@user.com' })
  @Expose()
  public email: string;

  @ApiProperty({ description: 'User\'s role.', example: UserRole.User, enum: UserRole })
  @Expose()
  public role: UserRole;

  @ApiProperty({ description: 'User\'s firstname and lastname.', example: 'John Doe' })
  @Expose()
  public name: string;
}
