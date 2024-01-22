import { TokenPayload, User } from '@project/types';

export function createJWTPayload(user: User): TokenPayload {
  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}
