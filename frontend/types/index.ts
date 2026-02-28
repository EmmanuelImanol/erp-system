export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}