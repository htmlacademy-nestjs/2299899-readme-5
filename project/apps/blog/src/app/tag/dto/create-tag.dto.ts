import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: 'Unique post tag title',
    example: 'tag_1',
  })
  public title: string;
}
