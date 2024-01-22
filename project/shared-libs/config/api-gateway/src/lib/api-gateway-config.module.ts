import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import apiGatewayConfig from './api-gateway.config';
import { ENV_FILE_PATH } from './api-gateway.const';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [apiGatewayConfig],
      envFilePath: ENV_FILE_PATH,
    }),
  ],
})
export class ApiGatewayConfigModule {}
