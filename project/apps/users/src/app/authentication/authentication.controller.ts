import {
    Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import { RequestWithTokenPayload } from '@project/types';

import { BlogUserEntity } from '../blog-user/blog-user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { API_AUTH_HEADER, UsersApiMessage } from './authentication.const';
import { AuthenticationService } from './authentication.service';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { OnlyAnonymousException } from './exceptions/only-anonymous.exception';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { TokenPayloadRdo } from './rdo/token-payload.rdo';
import { UserRdo } from './rdo/user.rdo';

interface RequestWithUser {
  user?: BlogUserEntity;
}

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @ApiResponse({ status: HttpStatus.CREATED, description: UsersApiMessage.UserCreated })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: UsersApiMessage.UserCreateForbidden })
  @Post('register')
  @UseGuards(AuthGuard(['jwt', 'anonymous']))
  public async create(@Req() { user }: RequestWithUser, @Body() dto: CreateUserDto) {
    if (user.email) {
      throw new OnlyAnonymousException();
    }

    const newUser = await this.authService.register(dto);
    const { email, name } = newUser;
    await this.notificationsService.registerSubscriber({ email, name });

    return fillDto(UserRdo, newUser.toPOJO());
  }

  @ApiResponse({ type: LoggedUserRdo, status: HttpStatus.OK, description: UsersApiMessage.LoginSuccess })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: UsersApiMessage.LoginError })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(@Req() { user }: RequestWithUser) {
    const userToken = await this.authService.createUserToken(user);
    return fillDto(LoggedUserRdo, { ...user.toPOJO(), ...userToken });
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ type: LoggedUserRdo, status: HttpStatus.OK, description: UsersApiMessage.RefreshOk })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  public async refreshToken(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user);
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ type: TokenPayloadRdo, status: HttpStatus.OK, description: 'Check user token' })
  @Post('check')
  @UseGuards(JwtAuthGuard)
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.OK, description: UsersApiMessage.ChangePasswordSuccess })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: UsersApiMessage.ChangePasswordUnauthorized })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: UsersApiMessage.ChangePasswordValidationError })
  @Post('change_password')
  @UseGuards(JwtAuthGuard)
  public async changePassword(@Req() { user }: RequestWithTokenPayload, @Body() dto: ChangeUserPasswordDto) {
    return this.authService.changeUserPassword(user.userId, dto);
  }

  @ApiResponse({ type: UserRdo, status: HttpStatus.OK, description: UsersApiMessage.UserCreated })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: UsersApiMessage.UserNotFound})
  @Get(':id')
  public async show(@Param('id') id: string) {
    const existUser = await this.authService.getUser(id);
    return fillDto(UserRdo, existUser.toPOJO());
  }
}
