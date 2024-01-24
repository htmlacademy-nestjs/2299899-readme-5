import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '@project/core';
import { fillDto } from '@project/helpers';
import { RequestWithTokenPayload } from '@project/types';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';
import { PostQuery } from './query/post.query';
import { PostPaginationRdo } from './rdo/post-pagination.rdo';
import { PostRdo } from './rdo/post.rdo';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
  ) {}

  @Get('/:id')
  public async show(@Param('id') id: string) {
    const post = await this.postService.getPost(id);
    return fillDto(PostRdo, post.toPOJO());
  }

  @Get('/')
  public async index(@Query() query: PostQuery) {
    const postsPagination = await this.postService.getAllPosts(query);
    const result = {
      ...postsPagination,
      entities: postsPagination.entities.map((post) => fillDto(PostRdo, post.toPOJO())),
    }
    return fillDto(PostPaginationRdo, result);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  public async create(@Req() { user }: RequestWithTokenPayload, @Body() dto: CreatePostDto) {
    const newPost = await this.postService.createPost(dto, user.userId);
    return fillDto(PostRdo, newPost.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string) {
    await this.postService.deletePost(id);
  }

  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.postService.updatePost(id, dto);
    return fillDto(PostRdo, updatedPost.toPOJO());
  }
}
