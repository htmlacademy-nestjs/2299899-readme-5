import { TokenPayload, User } from '@project/types';

export function createJWTPayload(user: User): TokenPayload {
  return {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    username: user.username,
  };
}
