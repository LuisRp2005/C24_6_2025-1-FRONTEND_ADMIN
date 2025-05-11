import { Course } from './Course';
import { Lesson } from './Lesson';

export interface Module {
  idModule: number;
  description: string;
  numberModule: string;
  name: string;
  course?: Course;
  lessons?: Lesson[];
  moduleOrder: number;
}
