import { Role } from './Role';

export enum StatusUserEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export interface User {
  idUser: number;
  name: string;
  lastName: string;
  maternalName: string;
  email: string;
  dni: string;
  password: string;
  registerDate: string; // ISO Date string
  phone: string;
  status: StatusUserEnum;
  updateDate?: string; // ISO Date string
  lastLogin?: string; // ISO Date string
  tokenRefresh?: string;
  tokenExpired?: string; // ISO Date string
  codeVerification?: string;
  verificationCodeExpiration?: string; // ISO Date string
  isVisible: boolean;
  role: Role;
}
