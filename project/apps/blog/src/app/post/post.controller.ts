import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@project/core';
import { fillDto } from '@project/helpers';
import { RequestWithTokenPayload } from '@project/types';

import { API_AUTH_HEADER } from '../comment/comment.const';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostAuthorGuard } from './guards/post-author.guard';
import { PostNotAuthorGuard } from './guards/post-not-author.guard';
import { PostUpdateInterceptor } from './interceptors/post-update.interceptor';
import { PostsApiMessage } from './post.const';
import { PostService } from './post.service';
import { PostQuery } from './query/post.query';
import { SearchPostsQuery } from './query/search-posts.query';
import { PostPaginationRdo } from './rdo/post-pagination.rdo';
import { PostRdo } from './rdo/post.rdo';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly notificationService: NotificationsService,
  ) {}

  @ApiResponse({ status: HttpStatus.OK, description: PostsApiMessage.PostsReadAll })
  @Get('/')
  public async index(@Query() query: PostQuery) {
    const postsPagination = await this.postService.getAllPosts(query);
    const result = {
      ...postsPagination,
      entities: postsPagination.entities.map((post) => fillDto(PostRdo, post.toPOJO())),
    }
    return fillDto(PostPaginationRdo, result);
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiBody({ description: 'New post data depending on post type', type: CreatePostDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: PostsApiMessage.PostCreated })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: PostsApiMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: PostsApiMessage.ValidationFailed })
  @Post('/')
  @UseGuards(JwtAuthGuard)
  public async create(@Req() { user }: RequestWithTokenPayload, @Body() dto: CreatePostDto) {
    const newPost = await this.postService.createPost(dto, user.userId);
    return fillDto(PostRdo, newPost.toPOJO());
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.OK, description: PostsApiMessage.PostsReadAll })
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

  @ApiResponse({ status: HttpStatus.OK, description: PostsApiMessage.PostsReadAll })
  @Post('/search')
  public async search(@Query() query: SearchPostsQuery) {
    const postsPagination = await this.postService.searchByTitle(query);
    const result = {
      ...postsPagination,
      entities: postsPagination.entities.map((post) => fillDto(PostRdo, post.toPOJO())),
    }
    return fillDto(PostPaginationRdo, result);
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.OK, description: PostsApiMessage.PostsReadAll })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: PostsApiMessage.Unauthorized })
  @Get('/newsletter')
  @UseGuards(JwtAuthGuard)
  public async newsletter(@Req() { user }: RequestWithTokenPayload, @Query() query: PostQuery) {
    const { email, userId } = user;
    const posts = await this.postService.getAllPosts(query);
    this.notificationService.sendNewsletter({ email, posts: posts.entities, id: userId });
  }

  @ApiResponse({ status: HttpStatus.OK, description: PostsApiMessage.PostRead })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: PostsApiMessage.PostNotFound })
  @Get('/:id')
  public async show(@Param('id') id: string) {
    const post = await this.postService.getPost(id);
    return fillDto(PostRdo, post.toPOJO());
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiBody({ description: 'New post data depending on post type', type: UpdatePostDto })
  @ApiResponse({ status: HttpStatus.OK, description: PostsApiMessage.PostUpdate })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: PostsApiMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: PostsApiMessage.PostAuthorForbidden })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: PostsApiMessage.ValidationFailed })
  @Patch('/:id')
  @UseInterceptors(PostUpdateInterceptor)
  @UseGuards(PostAuthorGuard)
  @UseGuards(JwtAuthGuard)
  public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.postService.updatePost(id, dto);
    return fillDto(PostRdo, updatedPost.toPOJO());
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: PostsApiMessage.PostDelete })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: PostsApiMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: PostsApiMessage.PostAuthorForbidden })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PostAuthorGuard)
  @UseGuards(JwtAuthGuard)
  public async destroy(@Param('id') id: string) {
    await this.postService.deletePost(id);
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.CREATED, description: PostsApiMessage.PostCreated })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: PostsApiMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: PostsApiMessage.PostNotAuthorForbidden })
  @Post('/:id/repost')
  @UseGuards(PostNotAuthorGuard)
  @UseGuards(JwtAuthGuard)
  public async repost(@Param('id') id: string, @Req() { user }: RequestWithTokenPayload) {
    const repostedPost = await this.postService.repostPost(id, user.userId);
    return fillDto(PostRdo, repostedPost.toPOJO());
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.CREATED, description: PostsApiMessage.PostUpdate })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: PostsApiMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: PostsApiMessage.PostLikeForbidden })
  @Post('/:id/likes')
  @UseGuards(JwtAuthGuard)
  public async toggleLike(@Param('id') id: string, @Req() { user }: RequestWithTokenPayload) {
    const updatedPost = await this.postService.toggleLike(id, user.userId);
    return fillDto(PostRdo, updatedPost.toPOJO());
  }
}
