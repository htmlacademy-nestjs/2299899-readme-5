import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtOptions } from '@project/config-users';

import { BlogUserModule } from '../blog-user/blog-user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthneticationService } from './authentication.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [
    BlogUserModule,
    JwtModule.registerAsync({ inject: [ConfigService], useFactory: getJwtOptions }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthneticationService, JwtAccessStrategy],
})
export class AuthenticationModule {}
