import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RefreshToken } from '@project/types';

@Schema({
  collection: 'refresh-sessions',
  timestamps: true,
})
export class RefreshTokenModel extends Document implements RefreshToken {
  @Prop({ required: true })
  public tokenId: string;

  @Prop({ required: true })
  public userId: string;

  @Prop()
  public createdAt: Date;

  @Prop({ required: true })
  public expiresIn: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshTokenModel);
