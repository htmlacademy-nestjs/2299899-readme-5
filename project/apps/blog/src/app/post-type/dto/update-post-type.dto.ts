import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostTypeDto {
  @ApiProperty({
    description: 'Unique post type title',
    example: 'flowers',
  })
  public title: string;
}
