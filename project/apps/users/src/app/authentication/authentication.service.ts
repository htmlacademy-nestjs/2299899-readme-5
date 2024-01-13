import { error } from 'console';
import dayjs from 'dayjs';
import { use } from 'passport';

import {
    ConflictException, HttpException, HttpStatus, Injectable, Logger, NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token, TokenPayload, User, UserRole } from '@project/types';

import { BlogUserEntity } from '../blog-user/blog-user.entity';
import { BlogUserRepository } from '../blog-user/blog-user.repository';
import {
    AUTH_USER_EXISTS, AUTH_USER_NOT_FOUND, AUTH_USER_PASSWORD_WRONG
} from './authentication.const';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthneticationService {
  private readonly logger = new Logger(AuthneticationService.name);

  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async register(dto: CreateUserDto) {
    const { email, username, name, birthDate, password } = dto;
    const blogUser = {
      email, username, name, role: UserRole.User,
      avatar: '', birthDate: dayjs(birthDate).toDate(),
      registerDate: dayjs().toDate(),
      passwordHash: '',
    };
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (existUser) {
      throw new ConflictException(AUTH_USER_EXISTS);
    }

    const userEntity = await new BlogUserEntity(blogUser).setPassword(password);

    return this.blogUserRepository.save(userEntity);
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    if (!await existUser.comparePassword(password)) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }

    return existUser;
  }

  public async getUser(id: string) {
    const existedUser = await this.blogUserRepository.findById(id);

    if (!existedUser) throw new NotFoundException(`User with id ${id} not found`);

    return existedUser;
  }

  public async createUserToken(user: User): Promise<Token> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      name: user.name,
    }

    try {
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } catch (error) {
      this.logger.error(`[Token generation error]: ${error.message}`);
      throw new HttpException('Token creation error.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
