import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import notificationsConfig from './notifications.config';

const ENV_FILE_PATH = 'apps/notifications/notifications.env';

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
