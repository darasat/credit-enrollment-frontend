export interface Student {
  studentId?: number;
  name: string;
  email: string;
  createdAt?: Date;
  studentSubjects?: StudentSubject[]; // Asegúrate de que esto sea un array
  studentEnrollments?: StudentProgramEnrollment[]; // Asegúrate de que esto sea un array
  programId?: number;
}

export interface StudentSubject {
  subjectId: number;
  subjectName: string;
}

export interface StudentProgramEnrollment {
  programId: number;
  enrollmentDate: Date;
}
