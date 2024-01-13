import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    getMongooseOptions, NotificationsConfigModule
} from '@project/shared-libs/config/notifications';

import { EmailSubscriberModule } from './email-subscriber/email-subscriber.module';

@Module({
  imports: [
    MongooseModule.forRootAsync(getMongooseOptions()),
    NotificationsConfigModule,
    EmailSubscriberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
