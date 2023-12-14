import { Module } from '@nestjs/common';

import { BlogUserModule } from '../blog-user/blog-user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthneticationService } from './authentication.service';

@Module({
  imports: [BlogUserModule],
  controllers: [AuthenticationController],
  providers: [AuthneticationService],
})
export class AuthenticationModule {}
