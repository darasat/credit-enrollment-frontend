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
  subjectTeacherMap: { [subjectId: number]: number } = {};

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private professorService: ProfessorService,
    private programService: ProgramService
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      programId: [null, Validators.required]
    });

    this.subjectService.getSubjects().subscribe(data => this.subjects = data);
    this.professorService.getAllTeachers().subscribe(data => this.teachers = data);
    this.programService.getAllPrograms().subscribe(data => this.programs = data);
  }

  onSubjectChange(subjectId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedSubjects.push(subjectId);
      this.subjectTeacherMap[subjectId] = 0; // Sin profesor asignado inicialmente
    } else {
      this.selectedSubjects = this.selectedSubjects.filter(id => id !== subjectId);
      delete this.subjectTeacherMap[subjectId];
    }
  }

  onTeacherSelect(subjectId: number, event: Event) {
    const teacherId = +(event.target as HTMLSelectElement).value;
    this.subjectTeacherMap[subjectId] = teacherId;
  }

  hasUnassignedTeachers(): boolean {
    return this.selectedSubjects.some(subjectId => !this.subjectTeacherMap[subjectId]);
  }

  hasDuplicateTeacher(): boolean {
  const assignedTeacherIds = Object.values(this.subjectTeacherMap).filter(id => id != null);
  return new Set(assignedTeacherIds).size !== assignedTeacherIds.length;
  }


  getFilteredTeachers(subjectId: number): Professor[] {
    const assignedTeacherIds = Object.values(this.subjectTeacherMap).filter(id => id !== 0);
    return this.teachers.filter(teacher => !assignedTeacherIds.includes(teacher.teacherId));
  }

  get canRegister(): boolean {
    return (
      this.studentForm.valid &&
      this.selectedSubjects.length === 3 && // Verificar que se seleccionen exactamente 3 materias
      !this.hasUnassignedTeachers() && // Asegurarse de que todos los profesores estén asignados
      !this.hasDuplicateTeacher() // Asegurarse de que no haya duplicados de profesores
    );
  }

  onSubmit() {
    if (!this.canRegister) {
      alert('Completa todos los campos, selecciona exactamente 3 materias, y asigna un profesor diferente a cada una.');
      return;
    }

    // Crear los registros de relación estudiante-materia-profesor
    const subjectTeachers: SubjectTeacher[] = this.selectedSubjects.map(subjectId => ({
      subjectId,
      teacherId: this.subjectTeacherMap[subjectId]
    }));

    const student: Student = {
      ...this.studentForm.value,
      subjectIds: this.selectedSubjects,
      subjectTeachers
    };

    // Registrar el estudiante primero
    this.studentService.registerStudent(student).subscribe({
      next: (studentResponse) => {
        const studentId = studentResponse.studentId;

        // Registrar las asignaciones de materias y profesores
        if (!studentId) {
          console.error('Error: studentId is undefined.');
          alert('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
          return;
        }

        const subjectTeacherRecords = subjectTeachers.map(subjectTeacher => ({
          studentId: studentId,
          subjectId: subjectTeacher.subjectId,
          teacherId: subjectTeacher.teacherId
        }));

        // Registrar las relaciones en la base de datos
        this.studentService.registerSubjectTeachers(subjectTeacherRecords).subscribe({
          next: () => {
            alert('Estudiante registrado exitosamente con sus materias y profesores asignados.');
          },
          error: (error) => {
            console.error('Error al registrar la relación estudiante-materia-profesor:', error);
            alert('Ocurrió un error al registrar la relación estudiante-materia-profesor.');
          }
        });
      },
      error: (error) => {
        console.error('Error al registrar el estudiante:', error);
        alert('Ocurrió un error al registrar el estudiante.');
      }
    });
  }
}
