export interface LessonRequest {
    imageLesson: string;
    title: string;
    description: string;
    urlVideo: string;
    pdfUrl: string;
    duration: string; // debe ser 'HH:mm:ss'
    uploadDate: string; // debe ser ISO, ej: '2025-05-11T10:45:00Z'
    idModule: number;
    lessonOrder: number;
  }