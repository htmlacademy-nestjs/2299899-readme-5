import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtOptions } from '@project/config-users';

import { BlogUserModule } from '../blog-user/blog-user.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { AuthenticationController } from './authentication.controller';
import { AuthneticationService } from './authentication.service';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    BlogUserModule,
    JwtModule.registerAsync({ inject: [ConfigService], useFactory: getJwtOptions }),
    NotificationsModule,
    RefreshTokenModule,
  ],
  controllers: [
    AuthenticationController,
  ],
  providers: [
    AuthneticationService,
    JwtAccessStrategy,
    LocalStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
  ],
})
export class AuthenticationModule {}
