import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthUser, UserRole } from '@project/types';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class BlogUserModel extends Document implements AuthUser {
  @Prop({
    required: true,
    unique: true,
  })
  public email: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  avatar: string;

  @Prop({
    required: true,
    type: String,
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @Prop({
    required: true,
  })
  public passwordHash: string;

  @Prop()
  public registerDate: Date;

  @Prop({
    required: true,
    default: 0,
  })
  public postsCount: number;

  @Prop({
    required: true,
    default: 0,
  })
  public subscribersCount: number;
}

export const BlogUserSchema = SchemaFactory.createForClass(BlogUserModel);
