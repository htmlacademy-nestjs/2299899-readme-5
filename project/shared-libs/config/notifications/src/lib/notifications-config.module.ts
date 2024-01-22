import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENV_FILE_PATH } from '../const';
import notificationsConfig from './notifications.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [notificationsConfig],
      envFilePath: ENV_FILE_PATH,
    }),
  ],
})
export class NotificationsConfigModule {}
