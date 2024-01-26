import 'multer';

import { Express } from 'express';

import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@project/types';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.Photo,
    required: false,
  })
  public type?: PostType;

  @ApiProperty({ description: '"Видео" post title', example: "Title", required: false })
  public videoTitle?: string;

  @ApiProperty({ description: '"Видео" post url', example: "https://www.youtube.com/watch?v=cwyTleTL06Y", required: false })
  public videoUrl?: string;

  @ApiProperty({ description: '"Текст" post title', example: "Title", required: false })
  public textTitle?: string;

  @ApiProperty({ description: '"Текст" post anounsment', example: "Anounsment", required: false })
  public textAnons?: string;

  @ApiProperty({ description: '"Текст" post content', example: "Content", required: false })
  public text?: string;

  @ApiProperty({ description: '"Цитата" post cite', example: "Cite", required: false })
  public cite?: string;

  @ApiProperty({ description: '"Цитата" post cite author', example: "Statham", required: false })
  public citeAuthor?: string;

  @ApiProperty({ description: '"Фото" post photoId', example: "65b2e759b06a0d028d76b87a", required: false })
  public photo?: string;

  @ApiProperty({ description: '"Ссылка" post url', example: "https://www.youtube.com/watch?v=cwyTleTL06Y", required: false })
  public url?: string;

  @ApiProperty({ description: '"Ссылка" post url description', example: "Url description", required: false })
  public urlDescription?: string;

  @ApiProperty({ description: 'List of tags', example: ['tag_1', 'ТЕГ_2', 'Стэтхем'], required: false })
  public tags?: string[];

  @ApiProperty({
    name: 'file',
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
    description: 'Photo or avatar picture',
    required: false,
  })
  public readonly file: Express.Multer.File;
}
