import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from '@project/types';

import { RefreshTokenEntity } from './refresh-token.entity';
import { RefreshTokenModel } from './refresh-token.model';

export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshTokenModel.name) private readonly refreshTokenModel: Model<RefreshTokenModel>,
  ) {}

  public async create(item: RefreshTokenEntity): Promise<RefreshToken> {
    return new this.refreshTokenModel(item).save();
  }

  public async deleteByTokenId(tokenId: string) {
    return this.refreshTokenModel.deleteOne({ tokenId }).exec();
  }

  public async findByTokenId(tokenId: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel.findOne({ tokenId }).exec();
  }

  public async deleteExpiredTokens() {
    return this.refreshTokenModel.deleteMany({ expiresIn: { $lt: new Date() } });
  }
}
