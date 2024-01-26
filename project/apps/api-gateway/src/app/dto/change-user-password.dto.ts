import { ApiProperty } from '@nestjs/swagger';

export class ChangeUserPasswordDto {
  @ApiProperty({ description: 'User\'s current password', example: '123456' })
  public currentPassword: string;

  @ApiProperty({ description: 'User\'s new password', example: 'qwerty' })
  public newPassword: string;
}
