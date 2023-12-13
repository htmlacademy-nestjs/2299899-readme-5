import { UserRole } from './user-role.enum';

export interface User {
  id?: string;
  email: string;
  username: string;
  name:string;
  birthDate: Date;
  role: UserRole;
  registerDate: Date;
}
