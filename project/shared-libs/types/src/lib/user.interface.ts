import { UserRole } from './user-role.enum';

export interface User {
  id?: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
}
