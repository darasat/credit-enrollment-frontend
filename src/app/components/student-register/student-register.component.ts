import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { SubjectService } from '../../services/subject.service';
import { ProfessorService } from '../../services/professor.service';
import { ProgramService } from '../../services/program.service';
import { Student } from '../interfaces/Student';
import { Subject } from '../interfaces/Subject';
import { Professor } from '../interfaces/Professor';
import { Program } from '../interfaces/Program';
import { SubjectTeacher } from '../interfaces/SubjectTeacher';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-student-register',
  standalone: true,
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class StudentRegisterComponent implements OnInit {
  studentForm!: FormGroup;
  subjects: Subject[] = [];
  teachers: Professor[] = [];
  programs: Program[] = [];
  selectedSubjects: number[] = [];
  subjectTeacherMap: { [subjectId: number]: number | null } = {};

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private professorService: ProfessorService,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      programId: [null, Validators.required],
    });

    this.loadInitialData();
  }

  loadInitialData(): void {
    this.subjectService.getSubjects().subscribe((data) => (this.subjects = data));
    this.professorService.getAllTeachers().subscribe((data) => {
      console.log('Profesores recibidos:', data);
      this.teachers = data;
    });

    this.programService.getAllPrograms().subscribe((data) => (this.programs = data));
  }
  

  toggleSubject(subjectId: number): void {
    const index = this.selectedSubjects.indexOf(subjectId);
    if (index > -1) {
      this.selectedSubjects.splice(index, 1);
      delete this.subjectTeacherMap[subjectId];
    } else if (this.selectedSubjects.length < 3) {
      this.selectedSubjects.push(subjectId);

      // Llama al endpoint para obtener el profesor asignado a la materia
      this.professorService.getAssignedTeacherForSubject(subjectId).subscribe({
        next: (professor) => {
          this.subjectTeacherMap[subjectId] = professor?.teacherId ?? null;
          console.log('Profesor asignado a la materia:', professor);
        },
        error: () => {
          this.subjectTeacherMap[subjectId] = null;
        }
      });
    }
  }

  isSelected(subjectId: number): boolean {
    return this.selectedSubjects.includes(subjectId);
  }

  getSubjectName(subjectId: number): string {
    const subject = this.subjects.find((s) => s.subjectId === subjectId);
    return subject ? subject.subjectName : '';
  }
  getAvailableTeacherForSubject(subjectId: number): Professor[] {
    // Buscar los profesores asignados a la materia usando el subjectId
    console.log (this.teachers)
    const teacher = this.teachers.filter(teacher => teacher.subjectIds?.includes(subjectId));
    console.log('Profesores disponibles para la materia:', teacher);
    return teacher;  // Retorna el arreglo de profesores
  }



  assignTeacher(subjectId: number, event: Event): void {
    const teacherId = +(event.target as HTMLSelectElement).value;
    this.subjectTeacherMap[subjectId] = teacherId === 0 ? null : teacherId;
  }

  hasUnassignedTeachers(): boolean {
    return this.selectedSubjects.some((subjectId) => this.subjectTeacherMap[subjectId] === null);
  }

  hasDuplicateTeacher(): boolean {
    const assignedTeacherIds = Object.values(this.subjectTeacherMap).filter(id => id !== null);
    return new Set(assignedTeacherIds).size !== assignedTeacherIds.length;
  }

  onSubmit(): void {
    if (this.studentForm.invalid || this.selectedSubjects.length !== 3 || this.hasUnassignedTeachers() || this.hasDuplicateTeacher()) {
      alert('Por favor, completa todos los campos, selecciona exactamente 3 materias y asigna un profesor diferente a cada una.');
      return;
    }

    const subjectTeachers: SubjectTeacher[] = this.selectedSubjects.map((subjectId) => ({
      subjectId,
      teacherId: this.subjectTeacherMap[subjectId]!,
    }));

    const student: Student = {
      ...this.studentForm.value,
      subjectIds: this.selectedSubjects,
      subjectTeachers,
    };

    this.studentService.registerStudent(student).subscribe({
      next: (studentResponse) => {
        const studentId = studentResponse.studentId;
        if (!studentId) {
          console.error('Error: studentId is undefined.');
          alert('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
          return;
        }

        const subjectTeacherRecords = subjectTeachers.map((st) => ({
          studentId,
          subjectId: st.subjectId,
          teacherId: st.teacherId,
        }));

        this.studentService.registerSubjectTeachers(subjectTeacherRecords).subscribe({
          next: () => {
            alert('Estudiante registrado exitosamente con sus materias y profesores asignados.');
            this.studentForm.reset();
            this.selectedSubjects = [];
            this.subjectTeacherMap = {};
          },
          error: (error) => {
            console.error('Error al registrar la relación estudiante-materia-profesor:', error);
            alert('Ocurrió un error al registrar la relación estudiante-materia-profesor.');
          },
        });
      },
      error: (error) => {
        console.error('Error al registrar el estudiante:', error);
        alert('Ocurrió un error al registrar el estudiante.');
      },
    });
  }
}