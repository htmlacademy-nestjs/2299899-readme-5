import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class LoggedUserRdo {
  @ApiProperty({ description: 'Unique user\'s ID', example: '65aeb270b4b011262dfa6ca6' })
  @Expose()
  public id: string;

  @ApiProperty({ description: 'Unique user\'s email.', example: 'user@user.com' })
  @Expose()
  public email: string;

  @ApiProperty({ description: 'Access token' })
  @Expose()
  public accessToken: string;

  @ApiProperty({ description: 'Refresh token' })
  @Expose()
  public refreshToken: string;
}
