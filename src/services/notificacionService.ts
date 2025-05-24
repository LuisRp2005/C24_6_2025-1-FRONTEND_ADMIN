import API from './api';
import { Notification } from '../models/Notification';

export const getNotifications = () =>
  API.get<Notification[]>('/notification');

export const getNotificationsPagination = (page: number, size: number) =>
  API.get(`/notification/all?page=${page}&size=${size}`);

export const getNotificationsByUser = (userId: number) =>
  API.get<Notification[]>(`/notification/user/${userId}`);

export const createNotification = (notification: Notification) =>
  API.post('/notification', notification);

export const createNotificationForAll = (notification: Notification) =>
  API.post('/notification/all', notification);

export const markAsRead = (notificationId: number) =>
  API.put(`/notification/mark-read/${notificationId}`);

export const deleteNotification = (notificationId: number) =>
  API.delete(`/notification/${notificationId}`);

export const getNotificationById = (notificationId: number) =>
  API.get<Notification>(`/notification/${notificationId}`);

export const updateNotification = (notificationId: number, notification: Notification) =>
  API.put(`/notification/${notificationId}`, notification);

