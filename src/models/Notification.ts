import { User } from './User';

export interface Notification {
  idNotification: number;
  user: User;
  notificationType: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
