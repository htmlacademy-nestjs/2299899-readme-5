import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { RabbitRouting, Subscriber } from '@project/types';

import { MailService } from '../mail/mail.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { NewsletterDto } from './dto/newsletter.dto';
import { EmailSubscriberService } from './email-subscriber.service';
import { getNewPosts } from './utils/get-new-posts.util';

@Controller()
export class EmailSubscriberController {
  constructor(
    private readonly subscriberService: EmailSubscriberService,
    private readonly mailService: MailService,
  ) {}

  @RabbitSubscribe({
    exchange: 'readme_notifications_income',
    routingKey: RabbitRouting.AddSubscriber,
    queue: 'readme_notifications_income_subscriber',
  })
  public async create(subscriber: CreateSubscriberDto) {
    const extendedSubscriber: Subscriber = { ...subscriber, notificationDate: new Date() };
    this.subscriberService.addSubscriber(extendedSubscriber);
    this.mailService.sendNotificationNewSubscriber(extendedSubscriber);
  }

  @RabbitSubscribe({
    exchange: 'readme_notifications_income',
    routingKey: RabbitRouting.SendNewsletter,
    queue: 'readme_notifications_income_newsletter',
  })
  public async sendNewsletter(dto: NewsletterDto) {
    const { email, posts } = dto;
    const recepient = await this.subscriberService.getSubscriber(email);
    if (recepient && posts.length > 0) {
      const newPosts = getNewPosts(dto, recepient);

      if (newPosts.length > 0) {
        await this.mailService.sendNewsletter(recepient.email, newPosts);
        this.subscriberService.updateNotificationDate(recepient);
      }
    }
  }
}
