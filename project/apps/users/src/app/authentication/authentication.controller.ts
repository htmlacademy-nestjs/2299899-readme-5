import {
    Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, UseGuards
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/helpers';

import { AuthneticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { UserRdo } from './rdo/user.rdo';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthneticationService,
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New user has been successfully created.'
  })
  @Post('register')
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.register(dto);
    return fillDto(UserRdo, newUser.toPOJO());
  }

  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: 'User has been successfully logged.'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Wrong password or login.'
  })
  @Post('login')
  public async login(@Body() dto: LoginUserDto) {
    const verifiedUser = await this.authService.verifyUser(dto);
    const userToken = await this.authService.createUserToken(verifiedUser);
    return fillDto(LoggedUserRdo, { ...verifiedUser.toPOJO(), ...userToken });
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User found.'
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async show(@Param('id') id: string) {
    const existUser = await this.authService.getUser(id);
    return fillDto(UserRdo, existUser.toPOJO());
  }

  @Get('/demo/:id')
  public async demoPipe(@Param('id') id: number) {
    console.log(typeof id);
  }
}
