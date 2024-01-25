import { Request } from 'express';

import { HttpService } from '@nestjs/axios';
import { Body, Controller, Inject, Post, Req, UseFilters } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { apiGatewayConfig } from '@project/shared-libs/config/api-gateway';

import { AppPath, ROOT_PATH } from './app.const';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';

@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiGatewayConfig.KEY) private readonly config: ConfigType<typeof apiGatewayConfig>,
  ) {}

  @Post('register')
  public async create(@Body() dto: CreateUserDto) {
    const response = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.usersPort}${AppPath.Register}`, dto);
    return response.data;
  }

  @Post('login')
  public async login(@Body() dto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(`http://localhost:${this.config.usersPort}/api/auth/login`, dto);
    return data;
  }

  @Post('refresh')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(`http://localhost:${this.config.usersPort}/api/auth/refresh`, null, {
      headers: { 'Authorization': req.headers['authorization'] },
    });

    return data;
  }
}
