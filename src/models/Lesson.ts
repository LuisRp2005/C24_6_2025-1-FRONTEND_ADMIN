import { Module } from './Module';
import { LessonProgress } from './LessonProgress';

export interface Lesson {
  idLesson: number;
  imageLesson: string;
  title: string;
  description: string;
  urlVideo: string;
  pdfUrl: string;
  duration: string;
  uploadDate: string;
  idModule: number;
  lessonOrder: number;
  module: Module;
  lessonProgresses: LessonProgress[];
}
