import { Request } from 'express';
import { Role } from '../enums/role.enum';

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
