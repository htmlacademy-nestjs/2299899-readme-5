import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiGatewayConfigModule } from '@project/shared-libs/config/api-gateway';

import { BlogController } from './blog.controller';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UsersController } from './users.controller';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('application.httpClientTimeout'),
        maxRedirects: configService.get('application.httpClientMaxRedirects'),
      }),
    }),
    ApiGatewayConfigModule,
  ],
  controllers: [
    BlogController,
    UsersController,
  ],
  providers: [
    CheckAuthGuard,
  ],
})
export class AppModule {}
