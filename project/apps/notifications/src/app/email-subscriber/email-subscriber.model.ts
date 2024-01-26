import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Subscriber } from '@project/types';

@Schema({
  collection: 'email-subscriber',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class EmailSubscriberModel extends Document implements Subscriber {
  @Prop({ required: true })
  public email: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public notificationDate: Date;
}

export const EmailSubscriberSchema = SchemaFactory.createForClass(EmailSubscriberModel);

EmailSubscriberSchema.virtual('id').get(function() {
  return this._id.toString();
});
