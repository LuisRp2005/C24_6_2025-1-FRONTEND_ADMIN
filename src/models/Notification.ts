import { User } from './User';

export interface Notification {
  idNotification: number;
  idUser: number;
  notificationType: string;
  message: string;
  isRead: boolean;
  user: User;
  createdAt: string; // ISO Date string
}
