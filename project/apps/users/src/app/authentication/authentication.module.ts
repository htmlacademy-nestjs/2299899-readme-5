import { Module } from '@nestjs/common';

import { AuthenticationController } from './authentication.controller';
import { AuthneticationService } from './authentication.service';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthneticationService],
})
export class AuthenticationModule {}
