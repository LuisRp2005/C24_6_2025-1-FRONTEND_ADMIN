import { Category } from './Category';
import { Level } from './Level';
import { User } from './User';

export interface Course {
  idCourse: number;
  imageProfile: string;
  imageBanner: string;
  description: string;
  name: string;
  authorName: string;
  price: number;
  uploadDate: string; // ISO Date string
  status: boolean;
  level: Level;
  category: Category;
  idAdmin: User;
}
