import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Subscriber } from '@project/types';

import { EMAIL_ADD_SUBSCRIBER_SUBJECT } from './mail.const';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendNotificationNewSubscriber(subscriber: Subscriber): Promise<void> {
    await this.mailerService.sendMail({
      to: subscriber.email,
      subject: EMAIL_ADD_SUBSCRIBER_SUBJECT,
      template: '../../assets/add-subscriber.hbs',
      context: {
        user: `${subscriber.name}`,
        email: `${subscriber.email}`,
      },
    });
  }
}
