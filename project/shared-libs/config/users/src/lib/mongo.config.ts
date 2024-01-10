import { plainToClass } from 'class-transformer';
import * as Joi from 'joi';

import { ConfigType, registerAs } from '@nestjs/config';

import { MONGO_PORTS } from './mongo/mongo.const';
import { MongoConfiguration } from './mongo/mongo.env';

export interface MongoConfig {
  host: string;
  name: string;
  port: number;
  user: string;
  password: string;
  authBase: string;
}

const dbValidationSchema = Joi.object({
  host: Joi.string().hostname().required(),
  port: Joi.number().port().default(MONGO_PORTS.DEFAULT),
  name: Joi.string().required(),
  user: Joi.string().required(),
  password: Joi.string().required(),
  authBase: Joi.string().required(),
});

function validateMongoConfig(config: MongoConfig): void {
  const { error } = dbValidationSchema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(`[DB Config Validation Error]: ${error.message}`);
  }
}

async function getDbConfig(): Promise<MongoConfiguration> {
  const config = plainToClass(MongoConfiguration, {
    host: process.env.MONGO_HOST,
    name: process.env.MONGO_DB,
    port: process.env.MONGO_PORT ? parseInt(process.env.MONGO_PORT, 10) : MONGO_PORTS.DEFAULT,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    authBase: process.env.MONGO_AUTH_BASE
  });

  await config.validate();

  return config;
};

export default registerAs('db', async (): Promise<ConfigType<typeof getDbConfig>> => {
  return getDbConfig();
});
