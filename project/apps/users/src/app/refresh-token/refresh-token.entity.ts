import { Entity } from '@project/core';
import { RefreshToken } from '@project/types';

export class RefreshTokenEntity implements Entity<string, RefreshToken> {
  public id?: string | undefined;
  public tokenId: string;
  public userId: string;
  public createdAt: Date;
  public expiresIn: Date;
  [key: string]: unknown;

  constructor(refreshToken: RefreshToken) {
    this.createdAt = new Date;
    this.populate(refreshToken);
  }

  public populate(data: RefreshToken): void {
    this.id = data.id || undefined;
    this.tokenId = data.tokenId;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.expiresIn = data.expiresIn;
  }

  public toPOJO(): RefreshTokenEntity {
    return { ...this };
  }
}
