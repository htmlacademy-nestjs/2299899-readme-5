import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseMongoRepository } from '@project/core';
import { Subscriber } from '@project/types';

import { EmailSubscriberEntity } from './email-subscriber.entity';
import { EmailSubscriberModel } from './email-subscriber.model';

@Injectable()
export class EmailSubscriberRepository extends BaseMongoRepository<EmailSubscriberEntity, EmailSubscriberModel> {
  constructor(
    @InjectModel(EmailSubscriberModel.name) private readonly emailSubscriberModel: Model<EmailSubscriberModel>,
  ) {
    super(emailSubscriberModel, EmailSubscriberEntity.fromObject);
  }

  public async create(item: EmailSubscriberEntity): Promise<Subscriber> {
    const newEmailSubscriber = new this.emailSubscriberModel(item);
    return newEmailSubscriber.save();
  }

  public async findByEmail(email: string): Promise<EmailSubscriberEntity | null> {
    const emailSubscriber = await this.model.findOne({ email }).exec();
    return this.createEntityFromDocument(emailSubscriber);
  }
}
