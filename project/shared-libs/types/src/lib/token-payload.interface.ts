import { UserRole } from './user-role.enum';

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  username: string;
  name: string;
}
