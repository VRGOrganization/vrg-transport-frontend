export type UserRole = "student" | "servant" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registrationNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
  remember?: boolean;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
  registrationNumber: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}