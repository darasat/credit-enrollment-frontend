export interface Subject {
  name: string;
  professor: string;
}
export interface Subject {
  subjectId: number;
  subjectName: string;
  credits: number;
}



export interface SubjectTeacher {
  subjectId: number;
  teacherId: number;
}
