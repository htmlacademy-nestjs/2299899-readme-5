import { Request } from 'express';

import { HttpService } from '@nestjs/axios';
import {
    Body, Controller, Get, HttpStatus, Inject, Param, Post, Req, UseFilters, UseGuards
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { apiGatewayConfig } from '@project/shared-libs/config/api-gateway';

import { API_AUTH_HEADER, API_REFRESH_HEADER, AppPath, ROOT_PATH, UsersMessage } from './app.const';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';

@ApiTags('users')
@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiGatewayConfig.KEY) private readonly config: ConfigType<typeof apiGatewayConfig>,
  ) {}

  @ApiResponse({ status: HttpStatus.CREATED, description: UsersMessage.UserCreated })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: UsersMessage.UserAlreadyExists })
  @Post('/register')
  public async create(@Body() dto: CreateUserDto) {
    const response = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.usersPort}${AppPath.Register}`, dto);
    return response.data;
  }

  @ApiResponse({ status: HttpStatus.CREATED, description: UsersMessage.LoginSuccess })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: UsersMessage.LoginNotFound })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: UsersMessage.LoginWrongPassword })
  @Post('/login')
  public async login(@Body() dto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.usersPort}${AppPath.Login}`, dto);
    return data;
  }

  @ApiHeader(API_REFRESH_HEADER)
  @ApiResponse({ status: HttpStatus.CREATED, description: UsersMessage.RefreshTokenSuccess })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: UsersMessage.RefreshTokenError })
  @Post('/refresh')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.usersPort}${AppPath.Refresh}`, null, {
      headers: { 'Authorization': req.headers['authorization'] },
    });

    return data;
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.CREATED, description: UsersMessage.ChangePasswordSuccess })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: UsersMessage.ChangePasswordError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: UsersMessage.ChangePasswordValidationError })
  @Post('change_password')
  @UseGuards(CheckAuthGuard)
  public async changePassword(@Req() req: Request, @Body() dto: ChangeUserPasswordDto) {
    await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.usersPort}${AppPath.ChangePassword}`, dto, {
      headers: { 'Authorization': req.headers['authorization'] },
    });
  }

  @ApiResponse({ status: HttpStatus.OK, description: UsersMessage.UserRead })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: UsersMessage.UserNotFound })
  @Get('/:id')
  public async read(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.usersPort}${AppPath.Users}/${id}`);
    const postsResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.blogPort}${AppPath.Users}?userId=${id}`);

    data.postsCount = postsResponse.data.totalItems;

    if (data.avatar) {
      const uploaderResponse = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.fileStoragePort}${AppPath.Files}/${data.avatar}`)
      data.avatar = uploaderResponse.data;
    }

    return data;
  }
}
