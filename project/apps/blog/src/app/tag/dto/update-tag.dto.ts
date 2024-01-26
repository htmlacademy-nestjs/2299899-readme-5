import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto {
  @ApiProperty({ description: 'Unique post tag title', example: 'tag_2' })
  public title: string;
}
