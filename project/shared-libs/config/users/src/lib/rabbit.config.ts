import * as Joi from 'joi';

import { registerAs } from '@nestjs/config';

import { DefaultPort } from '../const';

export interface RabbitConfig {
  host: string;
  password: string;
  user: string;
  queue: string;
  exchange: string;
  port: number;
}

const validationSchema = Joi.object({
  host: Joi.string().valid().hostname().required(),
  password: Joi.string().required(),
  port: Joi.number().port().default(DefaultPort.Rabbit),
  user: Joi.string().required(),
  queue: Joi.string().required(),
  exchange: Joi.string().required(),
});

function validateConfig(config: RabbitConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) throw new Error(`[Users Rabbit config validation error]: ${error.message}`);
}

function getConfig(): RabbitConfig {
  const config: RabbitConfig = {
    host: process.env.RABBIT_HOST,
    password: process.env.RABBIT_PASSWORD,
    port: parseInt(process.env.RABBIT_PORT ?? DefaultPort.Rabbit.toString(), 10),
    user: process.env.RABBIT_USER,
    queue: process.env.RABBIT_QUEUE,
    exchange: process.env.RABBIT_EXCHANGE,
  }

  validateConfig(config);
  return config;
}

export default registerAs('rabbit', getConfig);
