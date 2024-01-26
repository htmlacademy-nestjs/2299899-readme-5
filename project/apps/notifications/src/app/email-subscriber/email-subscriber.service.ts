import { Injectable } from '@nestjs/common';
import { Subscriber } from '@project/types';

import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { EmailSubscriberEntity } from './email-subscriber.entity';
import { EmailSubscriberRepository } from './email-subscriber.repository';

@Injectable()
export class EmailSubscriberService {
  constructor(
    private readonly emailSubscriberRepository: EmailSubscriberRepository,
  ) {}

  public async addSubscriber(subscriber: CreateSubscriberDto) {
    const { email } = subscriber;
    const existedSubscriber = await this.emailSubscriberRepository.findByEmail(email);

    if (existedSubscriber) {
      return existedSubscriber;
    }

    return this.emailSubscriberRepository.create(new EmailSubscriberEntity().populate({ ...subscriber, notificationDate: new Date()}));
  }

  public async getSubscriber(email: string) {
    return await this.emailSubscriberRepository.findByEmail(email);
  }

  public async updateNotificationDate(subscriber: Subscriber) {
    const updatedSubscriber = new EmailSubscriberEntity().populate({ ...subscriber, notificationDate: new Date() });
    return await this.emailSubscriberRepository.update(subscriber.id, updatedSubscriber);
  }
}
