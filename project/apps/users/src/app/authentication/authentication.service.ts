import dayjs from 'dayjs';
import * as crypto from 'node:crypto';

import {
    ConflictException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '@project/config-users';
import { createJWTPayload } from '@project/helpers';
import { Token, User, UserRole } from '@project/types';

import { BlogUserEntity } from '../blog-user/blog-user.entity';
import { BlogUserRepository } from '../blog-user/blog-user.repository';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { AuthUserErrorMessage } from './authentication.const';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  public async register(dto: CreateUserDto) {
    const { email, name, password } = dto;
    const blogUser = {
      email,
      name,
      role: UserRole.User,
      avatar: '',
      registerDate: new Date(),
      passwordHash: '',
      postsCount: 0,
      subscribersCount: 0,
    };
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (existUser) {
      throw new ConflictException(AuthUserErrorMessage.UserExists);
    }

    const userEntity = await new BlogUserEntity(blogUser).setPassword(password);

    return this.blogUserRepository.save(userEntity);
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(AuthUserErrorMessage.UserNotFound);
    }

    if (!await existUser.comparePassword(password)) {
      throw new UnauthorizedException(AuthUserErrorMessage.WrongPassword);
    }

    return existUser;
  }

  public async getUser(id: string) {
    const existedUser = await this.blogUserRepository.findById(id);

    if (!existedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return existedUser;
  }

  public async getUserByEmail(email: string) {
    const existedUser = await this.blogUserRepository.findByEmail(email);

    if (!existedUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return existedUser;
  }

  public async createUserToken(user: User): Promise<Token> {
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = { ...accessTokenPayload, tokenId: crypto.randomUUID() };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn,
      });
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`[Token generation error]: ${error.message}`);
      throw new HttpException('Token creation error.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async changeUserPassword(id: string, dto: ChangeUserPasswordDto): Promise<BlogUserEntity> {
    const userData = await this.getUser(id);

    if (!await userData.comparePassword(dto.currentPassword)) {
      throw new UnauthorizedException(AuthUserErrorMessage.WrongPassword);
    }

    await userData.setPassword(dto.newPassword);
    return await this.blogUserRepository.update(id, userData);
  }
}
