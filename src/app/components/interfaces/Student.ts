export interface Student {
  studentId?: number;
  name: string;
  email: string;
  createdAt?: Date;
  subjectIds?: number[]; // Lista de materias seleccionadas
  subjectTeachers?: SubjectTeacher[]; // Asignación materia-profesor
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
