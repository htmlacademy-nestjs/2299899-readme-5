import { IsEmail, IsNotEmpty } from 'class-validator';

import { ValidationMessage } from '../email-subscriber.const';

export class CreateSubscriberDto {
  @IsEmail({}, { message: ValidationMessage.Email })
  public email: string;

  @IsNotEmpty({ message: ValidationMessage.Name })
  public name: string;
}
