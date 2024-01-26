import 'multer';

import { Express } from 'express';

import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@project/types';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.Photo,
  })
  public type: PostType;

  @ApiProperty({ description: '"Видео" post title', example: "Title" })
  public videoTitle: string;

  @ApiProperty({ description: '"Видео" post url', example: "https://www.youtube.com/watch?v=cwyTleTL06Y" })
  public videoUrl: string;

  @ApiProperty({ description: '"Текст" post title', example: "Title" })
  public textTitle: string;

  @ApiProperty({ description: '"Текст" post anounsment', example: "Anounsment" })
  public textAnons: string;

  @ApiProperty({ description: '"Текст" post content', example: "Content" })
  public text: string;

  @ApiProperty({ description: '"Цитата" post cite', example: "Cite" })
  public cite: string;

  @ApiProperty({ description: '"Цитата" post cite author', example: "Statham" })
  public citeAuthor: string;

  @ApiProperty({ description: '"Фото" post photoId', example: "65b2e759b06a0d028d76b87a" })
  public photo: string;

  @ApiProperty({ description: '"Ссылка" post url', example: "https://www.youtube.com/watch?v=cwyTleTL06Y" })
  public url: string;

  @ApiProperty({ description: '"Ссылка" post url description', example: "Url description" })
  public urlDescription: string;

  @ApiProperty({ description: 'List of tags', example: ['tag_1', 'ТЕГ_2', 'Стэтхем'], required: false })
  public tags?: string[];

  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  public readonly file: Express.Multer.File;
}
