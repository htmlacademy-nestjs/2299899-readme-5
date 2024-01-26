import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NotificationsConfig } from '@project/shared-libs/config/notifications';
import { Post, Subscriber } from '@project/types';

import { EmailSubject } from './mail.const';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(NotificationsConfig.KEY) private readonly notificationsConfig: ConfigType<typeof NotificationsConfig>,
  ) {}

  public async sendNotificationNewSubscriber(subscriber: Subscriber): Promise<void> {
    await this.mailerService.sendMail({
      from: this.notificationsConfig.mail.from,
      to: subscriber.email,
      subject: EmailSubject.AddSubscriber,
      template: './add-subscriber',
      context: {
        user: `${subscriber.name}`,
        email: `${subscriber.email}`,
      },
    });
  }

  public async sendNewsletter(email: string, posts: Post[]): Promise<void> {
    await this.mailerService.sendMail({
      from: this.notificationsConfig.mail.from,
      to: email,
      subject: EmailSubject.Newsletter,
      template: './newsletter.hbs',
      context: { posts },
    });
  }
}
