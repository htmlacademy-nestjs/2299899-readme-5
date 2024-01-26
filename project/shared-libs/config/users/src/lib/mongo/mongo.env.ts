import { IsNumber, IsOptional, IsString, Max, Min, validateOrReject } from 'class-validator';

import { EnvMongoValidationMessage, MongoPort } from '../../const';

export class MongoConfiguration {
  @IsString({ message: EnvMongoValidationMessage.DBNameRequired })
  public name: string;

  @IsString({ message: EnvMongoValidationMessage.DBHostRequired })
  public host: string;

  @IsNumber({}, { message: EnvMongoValidationMessage.DBPortRequired })
  @Min(MongoPort.MIN)
  @Max(MongoPort.MAX)
  @IsOptional()
  public port: number = MongoPort.DEFAULT;

  @IsString({ message: EnvMongoValidationMessage.DBUserRequired })
  public user: string;

  @IsString({ message: EnvMongoValidationMessage.DBPasswordRequired })
  public password: string;

  @IsString({ message: EnvMongoValidationMessage.DBBaseAuthRequired })
  public authBase: string;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
