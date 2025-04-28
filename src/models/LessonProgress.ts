import { Lesson } from './Lesson';
import { User } from './User';

export interface LessonProgress {
  idLessonProgress: number;
  user: User;
  lesson: Lesson;
  playbackTime: number; // Time in seconds or a similar unit
  completed: boolean;
  lastAccess?: string; // ISO Date string, optional
}
