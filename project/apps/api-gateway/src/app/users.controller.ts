import { Request } from 'express';

import { HttpService } from '@nestjs/axios';
import { Body, Controller, Inject, Post, Req, UseFilters } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { apiGatewayConfig } from '@project/shared-libs/config/api-gateway';

import { LoginUserDto } from './dto/login-user.dto';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';

@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiGatewayConfig.KEY) private readonly config: ConfigType<typeof apiGatewayConfig>,
  ) {}

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(`http://localhost:${this.config.usersPort}/api/auth/login`, loginUserDto);
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
