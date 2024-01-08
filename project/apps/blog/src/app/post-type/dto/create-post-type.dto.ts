import { ApiProperty } from '@nestjs/swagger';

export class CreatePostTypeDto {
  @ApiProperty({
    description: 'Unique post type title',
    example: 'flowers',
  })
  public title: string;
}
