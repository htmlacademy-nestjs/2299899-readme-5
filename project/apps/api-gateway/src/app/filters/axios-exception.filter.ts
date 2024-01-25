import { AxiosError } from 'axios';
import { Response } from 'express';

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(error: AxiosError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const statusText = error.response?.statusText || INTERNAL_SERVER_ERROR_MESSAGE;
    const message = error.response ? error.response.data['message'] : { error: error.cause.message, url: error.config.url };

    response.status(status).json({ message, error: statusText, statusCode: status });
  }
}
