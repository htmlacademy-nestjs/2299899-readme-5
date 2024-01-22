import { HttpService } from '@nestjs/axios';
import {
    Body, Controller, Inject, Post, UseFilters, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { apiGatewayConfig } from '@project/shared-libs/config/api-gateway';

import { AddNewPostDto } from './dto/add-new-post.dto';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UserIdInterceptor } from './interceptors/userid.interceptor';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiGatewayConfig.KEY) private readonly config: ConfigType<typeof apiGatewayConfig>,
  ) {}

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(UserIdInterceptor)
  @Post('/')
  public async create(@Body() dto: AddNewPostDto) {
    const { data } = await this.httpService.axiosRef.post(`http://localhost:${this.config.blogPort}/blog`, dto);
    return data;
  }
}
