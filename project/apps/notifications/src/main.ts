/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { GLOBAL_PREFIX } from './const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);

  const port = process.env.APP_PORT;
  await app.listen(port);
  Logger.log(`🚀 Application "Notifications" is running on: http://localhost:${port}/${GLOBAL_PREFIX}`);
}

bootstrap();
