import type { Role } from '../../static/roles';

export interface Member {
  id: number;
  email: string;
  username: string;
  role: Role;
  createdAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    member?: Member;
  };
}
