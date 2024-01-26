import 'multer';

import { Express } from 'express';
import FormData from 'form-data';

import { HttpService } from '@nestjs/axios';
import {
    Body, Controller, Delete, Get, HttpStatus, Inject, Param, Patch, Post, Query, UploadedFile,
    UseFilters, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getAuthHeader } from '@project/helpers';
import { apiGatewayConfig } from '@project/shared-libs/config/api-gateway';

import { API_AUTH_HEADER, AppPath, BlogMessage, ROOT_PATH } from './app.const';
import { Token } from './decorators/token.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UserIdInterceptor } from './interceptors/user-id.interceptor';
import { PostQuery } from './queries/post.query';
import { SearchPostsQuery } from './queries/search-posts.query';

@ApiTags('blog')
@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiGatewayConfig.KEY) private readonly config: ConfigType<typeof apiGatewayConfig>,
  ) {}

  @ApiResponse({ status: HttpStatus.OK, description: BlogMessage.PostsReadAll })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogMessage.PostsNotFound })
  @Get('/')
  public async readMany(@Query() query: PostQuery) {
    const queryArray = [];
    for (const [key, value] of Object.entries(query)) {
      queryArray.push(`${key}=${value}`);
    }

    const { data } = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}?${queryArray.join('&')}`);
    return data;
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiBody({ description: 'New post data depending on post type', type: CreatePostDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: BlogMessage.PostCreated })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: BlogMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: BlogMessage.ValidationFailed })
  @Post('/')
  @UseInterceptors(FileInterceptor('file'), UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async create(@Token() token: string, @Body() dto: CreatePostDto, @UploadedFile() file: Express.Multer.File) {
    const typeForFile = dto.type === 'Фото' ? 'photo' : 'avatar';

    if (file) {
      const fileFormData = new FormData();
      fileFormData.append('file', Buffer.from(file.buffer), file.originalname);

      const responseUploader = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.fileStoragePort}${AppPath.Upload}/${typeForFile}`, fileFormData, getAuthHeader(token));
      dto[typeForFile] = responseUploader.data.id;
    }

    const { data } = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}`, dto, getAuthHeader(token));

    if (file) {
      const fileData = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.fileStoragePort}${AppPath.Files}/${data.photo}`);
      data[typeForFile] = fileData.data;
    }

    const usersResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.usersPort}${AppPath.Users}/${data.userId}`);
    const postsResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}?userId=${data.userId}`);
    usersResponse.data.postsCount = postsResponse.data.totalItems;
    data.user = usersResponse.data;

    return data;
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.OK, description: BlogMessage.PostsReadAll })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogMessage.PostsNotFound })
  @Get('/drafts')
  @UseInterceptors(UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async readDrafts(@Token() token: string) {
    const { data } = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}/drafts`, getAuthHeader(token))
    return data;
  }

  @ApiResponse({ status: HttpStatus.OK, description: BlogMessage.PostsReadAll })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogMessage.PostsNotFound })
  @Post('/search')
  public async search(@Query() query: SearchPostsQuery) {
    const queryArray = [];
    for (const [key, value] of Object.entries(query)) {
      queryArray.push(`${key}=${value}`);
    }
    const { data } = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}/search?${queryArray.join('&')}`)

    return data;
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.OK, description: BlogMessage.NewsletterSent })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: BlogMessage.Unauthorized })
  @Get('/newsletter')
  @UseGuards(CheckAuthGuard)
  public async newsletter(@Token() token: string) {
    await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}/newsletter`, getAuthHeader(token));
  }

  @ApiResponse({ status: HttpStatus.OK, description: BlogMessage.PostRead })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: BlogMessage.PostNotFound })
  @Get('/:id')
  public async read(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}/${id}`)

    const usersResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.usersPort}${AppPath.Users}/${data.userId}`);
    const postsResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}?userId=${data.userId}`);
    usersResponse.data.postsCount = postsResponse.data.totalItems;
    data.user = usersResponse.data;

    return data;
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiBody({ description: 'New post data depending on post type', type: UpdatePostDto })
  @ApiResponse({ status: HttpStatus.OK, description: BlogMessage.PostUpdate })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: BlogMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: BlogMessage.ValidationFailed })
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file'), UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async update(@Param('id') id: string, @Token() token: string, @Body() dto: UpdatePostDto, @UploadedFile() file: Express.Multer.File) {
    const typeForFile = dto.type === 'Фото' ? 'photo' : 'avatar';

    if (file) {
      const fileFormData = new FormData();
      fileFormData.append('file', Buffer.from(file.buffer), file.originalname);
      const responseUploader = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.fileStoragePort}${AppPath.Upload}/${typeForFile}`, fileFormData, getAuthHeader(token));
      dto[typeForFile] = responseUploader.data.id;
    }

    const { data } = await this.httpService.axiosRef.patch(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}/${id}`, dto, getAuthHeader(token));

    if (file) {
      const fileData = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.fileStoragePort}${AppPath.Files}/${data.photo}`);
      data[typeForFile] = fileData.data;
    }

    const usersResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.usersPort}${AppPath.Users}/${data.userId}`);
    const postsResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}?userId=${data.userId}`);
    usersResponse.data.postsCount = postsResponse.data.totalItems;
    data.user = usersResponse.data;

    return data;
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: BlogMessage.PostDelete })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: BlogMessage.Unauthorized })
  @Delete('/:id')
  @UseGuards(CheckAuthGuard)
  public async delete(@Param('id') id: string, @Token() token: string) {
    await this.httpService.axiosRef.delete(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}/${id}`, getAuthHeader(token));
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiBody({ description: 'New comment', type: CreateCommentDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: BlogMessage.CommentCreate })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: BlogMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: BlogMessage.ValidationFailed })
  @Post('/:id/comments')
  @UseInterceptors(UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async comment(@Param('id') id: string, @Body() dto: CreateCommentDto, @Token() token: string) {
    await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}/${id}/comments`, dto, getAuthHeader(token));
    return await this.read(id);
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.OK, description: BlogMessage.LikeToggled })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: BlogMessage.Unauthorized })
  @Post('/:id/likes')
  @UseInterceptors(UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async toggleLike(@Param('id') id: string, @Token() token: string) {
    await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}/${id}/likes`, '', getAuthHeader(token));
    return await this.read(id);
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.CREATED, description: BlogMessage.PostCreated })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: BlogMessage.Unauthorized })
  @Post('/:id/repost')
  @UseInterceptors(UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async repost(@Param('id') id: string, @Token() token: string) {
    const { data } = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}/${id}/repost`, '', getAuthHeader(token));

    const usersResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.usersPort}${AppPath.Users}/${data.userId}`);
    const postsResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Posts}?userId=${data.userId}`);
    usersResponse.data.postsCount = postsResponse.data.totalItems;
    data.user = usersResponse.data;

    return data;
  }
}
