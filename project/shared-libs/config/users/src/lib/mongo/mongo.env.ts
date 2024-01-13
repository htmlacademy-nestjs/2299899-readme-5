import { IsNumber, IsOptional, IsString, Max, Min, validateOrReject } from 'class-validator';

import { MONGO_PORTS } from './mongo.const';
import { EnvValidationMessage } from './mongo.messages';

export class MongoConfiguration {
  @IsString({ message: EnvValidationMessage.DBNameRequired })
  public name: string;

  @IsString({ message: EnvValidationMessage.DBHostRequired })
  public host: string;

  @IsNumber({}, { message: EnvValidationMessage.DBPortRequired })
  @Min(MONGO_PORTS.MIN)
  @Max(MONGO_PORTS.MAX)
  @IsOptional()
  public port: number = MONGO_PORTS.DEFAULT;

  @IsString({ message: EnvValidationMessage.DBUserRequired })
  public user: string;

  @IsString({ message: EnvValidationMessage.DBPasswordRequired })
  public password: string;

  @IsString({ message: EnvValidationMessage.DBBaseAuthRequired })
  public authBase: string;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
