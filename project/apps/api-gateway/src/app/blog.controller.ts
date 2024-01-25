import 'multer';

import { Express } from 'express';
import FormData from 'form-data';

import { HttpService } from '@nestjs/axios';
import {
    Body, Controller, Get, Inject, Param, Post, Req, UploadedFile, UseFilters, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { getAuthHeader } from '@project/helpers';
import { apiGatewayConfig } from '@project/shared-libs/config/api-gateway';

import { ROOT_PATH } from './app.const';
import { Token } from './decorators/token.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UserIdInterceptor } from './interceptors/user-id.interceptor';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiGatewayConfig.KEY) private readonly config: ConfigType<typeof apiGatewayConfig>,
  ) {}

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

  @Get('/:id')
  public async show(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(`http://localhost:${this.config.blogPort}/api/posts/${id}`)

    const usersResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.usersPort}/api/auth/${data.userId}`);
    const postsResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}/api/posts?userId=${data.userId}`);
    usersResponse.data.postsCount = postsResponse.data.totalItems;
    data.user = usersResponse.data;

    return data;
  }
}
