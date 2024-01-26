import { compare, genSalt, hash } from 'bcrypt';

import { Entity } from '@project/core';
import { AuthUser, UserRole } from '@project/types';

import { SALT_ROUNDS } from './blog-user.const';

export class BlogUserEntity implements AuthUser, Entity<string> {
  public id: string;
  public email: string;
  public name: string;
  public avatar: string;
  public role: UserRole;
  public passwordHash: string;
  public postsCount: number;
  public subscribersCount: number;
  public createdAt?: Date;

  constructor(user: AuthUser) {
    this.populate(user);
  }

  public toPOJO() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      role: this.role,
      passwordHash: this.passwordHash,
      registerDate: this.createdAt,
      postsCount: this.postsCount,
      subscribersCount: this.subscribersCount,
    }
  }

  public populate(data: AuthUser): void {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.avatar = data.avatar;
    this.role = data.role;
    this.passwordHash = data.passwordHash;
    this.createdAt = data.createdAt;
    this.postsCount = data.postsCount;
    this.subscribersCount = data.subscribersCount;
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
