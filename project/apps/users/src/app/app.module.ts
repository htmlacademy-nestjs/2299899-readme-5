import { Module } from '@nestjs/common';
import { ConfigUsersModule } from '@project/config-users';

import { AuthenticationModule } from './authentication/authentication.module';
import { BlogUserModule } from './blog-user/blog-user.module';

@Module({
  imports: [AuthenticationModule, BlogUserModule, ConfigUsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
