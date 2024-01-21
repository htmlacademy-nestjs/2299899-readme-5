import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';

import { ApplicationServiceURL } from './app.config';
import { AddNewPostDto } from './dto/add-new-post.dto';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UserIdInterceptor } from './interceptors/userid.interceptor';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(private readonly httpService: HttpService) {}

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(UserIdInterceptor)
  @Post('/')
  public async create(@Body() dto: AddNewPostDto) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Blog}/`, dto);
    return data;
  }
}
