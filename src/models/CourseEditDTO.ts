export interface CourseEditDTO {
    idCourse: number;
    name: string;
    authorName: string;
    description: string;
    price: number;
    imageProfile: string;
    imageBanner: string;
    status: boolean;
    uploadDate: string;
    levelId: number;
    categoryId: number;
  }