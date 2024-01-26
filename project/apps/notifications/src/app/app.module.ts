import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    getMongooseOptions, NotificationsConfigModule
} from '@project/shared-libs/config/notifications';

import { EmailSubscriberModule } from './email-subscriber/email-subscriber.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MongooseModule.forRootAsync(getMongooseOptions()),
    NotificationsConfigModule,
    EmailSubscriberModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
