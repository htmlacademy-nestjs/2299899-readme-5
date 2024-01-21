import { AxiosError } from 'axios';
import { Response } from 'express';

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(error: AxiosError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.response?.statusText || INTERNAL_SERVER_ERROR_MESSAGE;

    response.status(status).json({ statusCode: status, message });
  }
}
