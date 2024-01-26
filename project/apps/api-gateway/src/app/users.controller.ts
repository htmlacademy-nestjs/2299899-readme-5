import { Request } from 'express';

import { HttpService } from '@nestjs/axios';
import {
    Body, Controller, Get, Inject, Param, Post, Req, UseFilters, UseGuards
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { apiGatewayConfig } from '@project/shared-libs/config/api-gateway';

import { AppPath, ROOT_PATH } from './app.const';
import { Token } from './decorators/token.decorator';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';

@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiGatewayConfig.KEY) private readonly config: ConfigType<typeof apiGatewayConfig>,
  ) {}

  @Post('/register')
  public async create(@Body() dto: CreateUserDto) {
    const response = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.usersPort}${AppPath.Register}`, dto);
    return response.data;
  }

  @Post('/login')
  public async login(@Body() dto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(`http://localhost:${this.config.usersPort}/api/auth/login`, dto);
    return data;
  }

  @Post('/refresh')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(`http://localhost:${this.config.usersPort}/api/auth/refresh`, null, {
      headers: { 'Authorization': req.headers['authorization'] },
    });

    return data;
  }

  @Post('change_password')
  @UseGuards(CheckAuthGuard)
  public async changePassword(@Req() req: Request, @Body() dto: ChangeUserPasswordDto) {
    const { data } = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.usersPort}/api/auth/change_password`, dto, {
      headers: { 'Authorization': req.headers['authorization'] },
    });
  }

  @Get('/:id')
  public async read(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.usersPort}/api/auth/${id}`);
    const postsResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}/api/posts?userId=${id}`);

    data.postsCount = postsResponse.data.totalItems;

    if (data.avatar) {
      const uploaderResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.fileStoragePort}/api/files/${data.avatar}`)
      data.avatar = uploaderResponse.data;
    }

    return data;
  }
}
