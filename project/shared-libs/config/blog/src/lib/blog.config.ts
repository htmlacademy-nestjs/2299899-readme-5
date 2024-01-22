import * as Joi from 'joi';

import { registerAs } from '@nestjs/config';
import { Environment } from '@project/types';

import { DEFAULT_PORT } from '../const';

export interface BlogConfig {
  environment: string;
  appPort: number;
}

const validationSchema = Joi.object({
  environment: Joi.string().valid(...Object.values(Environment)).required(),
  appPort: Joi.number().port().default(DEFAULT_PORT),
});

function validateConfig(config: BlogConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(`[Blog config validation error]: ${error.message}`);
  }
}

function getConfig(): BlogConfig {
  const config: BlogConfig = {
    environment: process.env.NODE_ENV as Environment,
    appPort: parseInt(process.env.PORT || `${DEFAULT_PORT}`, 10),
  };

  validateConfig(config);
  return config;
}

export default registerAs('application', getConfig);
