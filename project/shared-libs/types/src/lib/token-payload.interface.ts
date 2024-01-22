import { UserRole } from './user-role.enum';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}
