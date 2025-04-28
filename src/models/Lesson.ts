import { Course } from './Course';
import { LessonProgress } from './LessonProgress';

export interface Lesson {
  idLesson: number;
  imageLesson: string;
  title: string;
  description: string;
  urlVideo: string;
  duration: string; // Time in string format (HH:mm:ss)
  uploadDate: string; // ISO Date string
  pdfUrl: string;
  idCourse: number;
  course: Course;
  lessonProgresses: LessonProgress[];
}
