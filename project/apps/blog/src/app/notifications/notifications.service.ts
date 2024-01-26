import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { rabbitConfig } from '@project/config-users';
import { RabbitRouting } from '@project/types';

import { SendNewsletterDto } from './dto/send-newsletter.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly rabbitClient: AmqpConnection,
    @Inject(rabbitConfig.KEY) private readonly rabbitOptions: ConfigType<typeof rabbitConfig>,
  ) {}

  public async sendNewsletter(dto: SendNewsletterDto) {
    return this.rabbitClient.publish<SendNewsletterDto>(
      this.rabbitOptions.exchange,
      RabbitRouting.SendNewsletter,
      { ...dto },
    );
  }
}
