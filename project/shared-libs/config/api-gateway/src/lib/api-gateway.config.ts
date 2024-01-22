import * as Joi from 'joi';

import { registerAs } from '@nestjs/config';
import { Environment } from '@project/types';

import { DefaultPorts, HttpClientDefaults } from '../const';

export interface ApiGatewayConfig {
  environment: string;
  appPort: number;
  blogPort: number;
  fileStoragePort: number;
  notificationsPort: number;
  usersPort: number;
  httpClientTimeout: number;
  httpClientMaxRedirects: number;
}

const validationSchema = Joi.object({
  environment: Joi.string().valid(...Object.values(Environment)).required(),
  appPort: Joi.number().port().default(DefaultPorts.App),
  blogPort: Joi.number().port().default(DefaultPorts.Blog),
  fileStoragePort: Joi.number().port().default(DefaultPorts.FileStorage),
  notificationsPort: Joi.number().port().default(DefaultPorts.Notifications),
  usersPort: Joi.number().port().default(DefaultPorts.Users),
  httpClientTimeout: Joi.number().required(),
  httpClientMaxRedirects: Joi.number().required(),
});

function validateConfig(config: ApiGatewayConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(`[ApiGatewayConfig config validation error]: ${error.message}`);
  }
}

function getConfig(): ApiGatewayConfig {
  const config: ApiGatewayConfig = {
    environment: process.env.NODE_ENV as Environment,
    appPort: parseInt(process.env.APP_PORT || `${DefaultPorts.App}`, 10),
    blogPort: parseInt(process.env.BLOG_PORT || `${DefaultPorts.Blog}`, 10),
    fileStoragePort: parseInt(process.env.FILE_STORAGE_PORT || `${DefaultPorts.FileStorage}`, 10),
    notificationsPort: parseInt(process.env.NOTIFICATIONS_PORT || `${DefaultPorts.Notifications}`, 10),
    usersPort: parseInt(process.env.USERS_PORT || `${DefaultPorts.Users}`, 10),
    httpClientTimeout: parseInt(process.env.HTTP_CLIENT_MAX_REDIRECTS || `${HttpClientDefaults.MaxRedirects}`, 10),
    httpClientMaxRedirects: parseInt(process.env.HTTP_CLIENT_TIMEOUT || `${HttpClientDefaults.Timeout}`,10),
  };

  validateConfig(config);
  return config;
}

export default registerAs('application', getConfig);
