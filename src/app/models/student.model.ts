export interface Student {
  id: number;
  name: string;
  courses: Course[];
}

export interface Course {
  id: number;
  name: string;
  credits: number;
  professorName: string;
}
