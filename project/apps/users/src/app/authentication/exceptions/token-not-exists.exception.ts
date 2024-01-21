import { UnauthorizedException } from '@nestjs/common';

export class TokenNotExistsException extends UnauthorizedException {
  constructor(tokenId: string) {
    super(`Token with id ${tokenId} doesn't exist`);
  }
}
