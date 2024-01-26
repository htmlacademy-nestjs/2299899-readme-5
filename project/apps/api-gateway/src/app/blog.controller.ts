import 'multer';

import { Express } from 'express';
import FormData from 'form-data';

import { HttpService } from '@nestjs/axios';
import {
    Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UploadedFile, UseFilters,
    UseGuards, UseInterceptors
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { getAuthHeader } from '@project/helpers';
import { apiGatewayConfig } from '@project/shared-libs/config/api-gateway';

import { ROOT_PATH } from './app.const';
import { Token } from './decorators/token.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UserIdInterceptor } from './interceptors/user-id.interceptor';
import { PostQuery } from './queries/post.query';
import { SearchPostsQuery } from './queries/search-posts.query';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiGatewayConfig.KEY) private readonly config: ConfigType<typeof apiGatewayConfig>,
  ) {}

  @Get('/')
  public async readMany(@Query() query: PostQuery) {
    const queryArray = [];
    for (const [key, value] of Object.entries(query)) {
      queryArray.push(`${key}=${value}`);
    }
    const { data } = await this.httpService.axiosRef.get(`http://localhost:${this.config.blogPort}/api/posts?${queryArray.join('&')}`)

    return data;
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('file'), UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async create(@Token() token: string, @Body() dto: CreatePostDto, @UploadedFile() file: Express.Multer.File) {
    const typeForFile = dto.type === 'Фото' ? 'photo' : 'avatar';

    if (file) {
      const fileFormData = new FormData();
      fileFormData.append('file', Buffer.from(file.buffer), file.originalname);
      const responseUploader = await this.httpService.axiosRef.post(
        `${ROOT_PATH}:${this.config.fileStoragePort}/api/files/upload/${typeForFile}`,
        fileFormData,
        getAuthHeader(token)
      );
      dto[typeForFile] = responseUploader.data.id;
    }

    const { data } = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.blogPort}/api/posts`, dto, getAuthHeader(token));

    if (file) {
      const fileData = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.fileStoragePort}/api/files/${data.photo}`);
      data[typeForFile] = fileData.data;
    }

    const usersResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.usersPort}/api/auth/${data.userId}`);
    const postsResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}/api/posts?userId=${data.userId}`);
    usersResponse.data.postsCount = postsResponse.data.totalItems;
    data.user = usersResponse.data;

    return data;
  }

  @Get('/drafts')
  @UseInterceptors(UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async readDrafts(@Token() token: string) {
    const { data } = await this.httpService.axiosRef.get(`http://localhost:${this.config.blogPort}/api/posts/drafts`, getAuthHeader(token))
    return data;
  }

  @Post('/search')
  public async search(@Query() query: SearchPostsQuery) {
    const queryArray = [];
    for (const [key, value] of Object.entries(query)) {
      queryArray.push(`${key}=${value}`);
    }
    const { data } = await this.httpService.axiosRef.post(`http://localhost:${this.config.blogPort}/api/posts/search?${queryArray.join('&')}`)

    return data;
  }

  @Get('/:id')
  public async read(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(`http://localhost:${this.config.blogPort}/api/posts/${id}`)

    const usersResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.usersPort}/api/auth/${data.userId}`);
    const postsResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}/api/posts?userId=${data.userId}`);
    usersResponse.data.postsCount = postsResponse.data.totalItems;
    data.user = usersResponse.data;

    return data;
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file'), UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async update(@Param('id') id: string, @Token() token: string, @Body() dto: UpdatePostDto, @UploadedFile() file: Express.Multer.File) {
    const typeForFile = dto.type === 'Фото' ? 'photo' : 'avatar';

    if (file) {
      const fileFormData = new FormData();
      fileFormData.append('file', Buffer.from(file.buffer), file.originalname);
      const responseUploader = await this.httpService.axiosRef.post(
        `${ROOT_PATH}:${this.config.fileStoragePort}/api/files/upload/${typeForFile}`,
        fileFormData,
        getAuthHeader(token)
      );
      dto[typeForFile] = responseUploader.data.id;
    }

    const { data } = await this.httpService.axiosRef.patch(`${ROOT_PATH}:${this.config.blogPort}/api/posts/${id}`, dto, getAuthHeader(token));

    if (file) {
      const fileData = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.fileStoragePort}/api/files/${data.photo}`);
      data[typeForFile] = fileData.data;
    }

    const usersResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.usersPort}/api/auth/${data.userId}`);
    const postsResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}/api/posts?userId=${data.userId}`);
    usersResponse.data.postsCount = postsResponse.data.totalItems;
    data.user = usersResponse.data;

    return data;
  }

  @Delete('/:id')
  @UseGuards(CheckAuthGuard)
  public async delete(@Param('id') id: string, @Token() token: string) {
    await this.httpService.axiosRef.delete(`${ROOT_PATH}:${this.config.blogPort}/api/posts/${id}`, getAuthHeader(token));
  }

  @Post('/:id/comments')
  @UseInterceptors(UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async comment(@Param('id') id: string, @Body() dto: CreatePostDto, @Token() token: string) {
    await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.blogPort}/api/posts/${id}/comments`, dto, getAuthHeader(token));
    return await this.read(id);
  }

  @Post('/:id/likes')
  @UseInterceptors(UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async toggleLike(@Param('id') id: string, @Token() token: string) {
    await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.blogPort}/api/posts/${id}/likes`, '', getAuthHeader(token));
    return await this.read(id);
  }

  @Post('/:id/repost')
  @UseInterceptors(UserIdInterceptor)
  @UseGuards(CheckAuthGuard)
  public async repost(@Param('id') id: string, @Token() token: string) {
    const { data } = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.blogPort}/api/posts/${id}/repost`, '', getAuthHeader(token));

    const usersResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.usersPort}/api/auth/${data.userId}`);
    const postsResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}/api/posts?userId=${data.userId}`);
    usersResponse.data.postsCount = postsResponse.data.totalItems;
    data.user = usersResponse.data;

    return data;
  }
}
