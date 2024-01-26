import * as crypto from 'node:crypto';
import { Observable } from 'rxjs';

import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';

export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestId = crypto.randomUUID();
    const request = context.switchToHttp().getRequest<Request>();
    request.headers['X-Request-Id'] = requestId;

    return next.handle();
  }
}
