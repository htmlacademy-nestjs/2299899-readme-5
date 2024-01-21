import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { HTTP_CLIENT_TIMEOUT, HTTPCLIENT_MAX_REDIRECTS } from './app.config';
import { BlogController } from './blog.controller';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UsersController } from './users.controller';

@Module({
  imports: [
    HttpModule.register({ timeout: HTTP_CLIENT_TIMEOUT, maxRedirects: HTTPCLIENT_MAX_REDIRECTS }),
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
