/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { RequestIdInterceptor } from './app/interceptors/request-id.interceptor';
import { GLOBAL_PREFIX } from './const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('The "API Gateway" service')
    .setDescription('API Gateway service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);

  app.useGlobalInterceptors(new RequestIdInterceptor());

  const configService = app.get(ConfigService);
  const port = configService.get('application.appPort');
  await app.listen(port);

  Logger.log(`🚀 Application "ApiGateway" is running on: http://localhost:${port}/${GLOBAL_PREFIX}`);
}

bootstrap();
