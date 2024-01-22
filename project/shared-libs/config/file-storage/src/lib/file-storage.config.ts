import * as Joi from 'joi';

import { registerAs } from '@nestjs/config';
import { Environment } from '@project/types';

import { DefaultPort } from '../const';

export interface FileStorageConfig {
  environment: string;
  appPort: number;
  uploadDirectory: string;
  db: {
    host: string;
    port: number;
    user: string;
    name: string;
    password: string;
    authBase: string;
  }
}

const validationSchema = Joi.object({
  environment: Joi.string().valid(...Object.values(Environment)).required(),
  appPort: Joi.number().port().default(DefaultPort.App),
  uploadDirectory: Joi.string().required(),
  db: Joi.object({
    host: Joi.string().valid().hostname(),
    port: Joi.number().port(),
    name: Joi.string().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    authBase: Joi.string().required(),
  }),
});

function validateConfig(config: FileStorageConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) throw new Error(`[FileStorage config validation error]: ${error.message}`);
}

function getConfig(): FileStorageConfig {
  const config: FileStorageConfig = {
    environment: process.env.NODE_ENV as Environment,
    appPort: parseInt(process.env.PORT || `${DefaultPort.App}`, 10),
    uploadDirectory: process.env.UPLOAD_DIRECTORY_PATH,
    db: {
      host: process.env.MONGO_HOST,
      port: parseInt(process.env.MONGO_PORT ?? DefaultPort.Mongo.toString(), 10),
      name: process.env.MONGO_DB,
      user: process.env.MONGO_USER,
      password: process.env.MONGO_PASSWORD,
      authBase: process.env.MONGO_AUTH_BASE,
    },
  };

  validateConfig(config);
  return config;
}

export default registerAs('application', getConfig);
