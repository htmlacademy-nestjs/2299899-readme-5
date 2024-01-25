import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from '@project/core';
import { fillDto } from '@project/helpers';
import { RequestWithTokenPayload } from '@project/types';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostAuthorGuard } from './guards/post-author.guard';
import { PostNotAuthorGuard } from './guards/post-not-author.guard';
import { PostUpdateInterceptor } from './interceptors/post-update.interceptor';
import { PostService } from './post.service';
import { PostQuery } from './query/post.query';
import { SearchPostsQuery } from './query/search-posts.query';
import { PostPaginationRdo } from './rdo/post-pagination.rdo';
import { PostRdo } from './rdo/post.rdo';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

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

  @Get('/drafts')
  @UseGuards(JwtAuthGuard)
  public async drafts(@Query() query: PostQuery, @Req() { user }: RequestWithTokenPayload) {
    const postsPagination = await this.postService.getAllDrafts(query, user.userId);
    const result = {
      ...postsPagination,
      entities: postsPagination.entities.map((post) => fillDto(PostRdo, post.toPOJO())),
    }
    return fillDto(PostPaginationRdo, result);
  }

  @Post('/search')
  public async search(@Query() query: SearchPostsQuery) {
    const postsPagination = await this.postService.searchByTitle(query);
    const result = {
      ...postsPagination,
      entities: postsPagination.entities.map((post) => fillDto(PostRdo, post.toPOJO())),
    }
    return fillDto(PostPaginationRdo, result);
  }

  @Get('/:id')
  public async show(@Param('id') id: string) {
    const post = await this.postService.getPost(id);
    return fillDto(PostRdo, post.toPOJO());
  }

  @Patch('/:id')
  @UseInterceptors(PostUpdateInterceptor)
  @UseGuards(PostAuthorGuard)
  @UseGuards(JwtAuthGuard)
  public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.postService.updatePost(id, dto);
    return fillDto(PostRdo, updatedPost.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PostAuthorGuard)
  @UseGuards(JwtAuthGuard)
  public async destroy(@Param('id') id: string) {
    await this.postService.deletePost(id);
  }

  @Post('/:id/repost')
  @UseGuards(PostNotAuthorGuard)
  @UseGuards(JwtAuthGuard)
  public async repost(@Param('id') id: string, @Req() { user }: RequestWithTokenPayload) {
    const repostedPost = await this.postService.repostPost(id, user.userId);
    return fillDto(PostRdo, repostedPost.toPOJO());
  }

  @Post('/:id/likes')
  @UseGuards(JwtAuthGuard)
  public async toggleLike(@Param('id') id: string, @Req() { user }: RequestWithTokenPayload) {
    const updatedPost = await this.postService.toggleLike(id, user.userId);
    return fillDto(PostRdo, updatedPost.toPOJO());
  }
}
