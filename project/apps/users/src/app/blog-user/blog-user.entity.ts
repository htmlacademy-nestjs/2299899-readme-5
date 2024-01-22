import { compare, genSalt, hash } from 'bcrypt';

import { Entity } from '@project/core';
import { AuthUser, UserRole } from '@project/types';

import { SALT_ROUNDS } from './blog-user.const';

export class BlogUserEntity implements AuthUser, Entity<string> {
  public _id: string;
  public email: string;
  public name: string;
  public avatar: string;
  public role: UserRole;
  public passwordHash: string;

  constructor(user: AuthUser) {
    this.populate(user);
  }

  public toPOJO() {
    return {
      _id: this._id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      role: this.role,
      passwordHash: this.passwordHash,
    }
  }

  public populate(data: AuthUser): void {
    this._id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.avatar = data.avatar;
    this.role = data.role;
    this.passwordHash = data.passwordHash;
  }

  public async setPassword(password: string): Promise<BlogUserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  static fromObject(data: AuthUser): BlogUserEntity {
    return new BlogUserEntity(data);
  }
}
