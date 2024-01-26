import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENV_FILE_PATH } from '../const';
import apiGatewayConfig from './api-gateway.config';

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
