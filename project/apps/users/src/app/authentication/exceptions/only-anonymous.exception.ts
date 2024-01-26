import { ForbiddenException } from '@nestjs/common';

export class OnlyAnonymousException extends ForbiddenException {
  constructor() {
    super(`Forbidden. Allowed only for unauthorized`);
  }
}
