import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { SubjectService } from '../../services/subject.service';
import { ProfessorService } from '../../services/professor.service';
import { ProgramService } from '../../services/program.service';
import { Student } from '../interfaces/Student';
import { Subject } from '../interfaces/Subject';
import { Professor } from '../interfaces/Professor';
import { Program } from '../interfaces/Program';
import { SubjectTeacher } from '../interfaces/Student';
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
      this.selectedSubjects = [...this.selectedSubjects, subjectId];
      this.subjectTeacherMap[subjectId] = 0;
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
    return this.selectedSubjects.some(subjectId => this.subjectTeacherMap[subjectId] === 0);
  }

  onSubmit() {
    if (this.studentForm.invalid || this.selectedSubjects.length === 0 || this.hasUnassignedTeachers()) {
      alert('Por favor complete todos los campos, seleccione al menos una materia y asigne un profesor a cada materia seleccionada.');
      return;
    }

    const subjectTeachers: SubjectTeacher[] = this.selectedSubjects.map(subjectId => ({
      subjectId,
      teacherId: this.subjectTeacherMap[subjectId]
    }));

    const student: Student = {
      ...this.studentForm.value,
      subjectIds: this.selectedSubjects,
      subjectTeachers: subjectTeachers
    };

    this.studentService.registerStudent(student).subscribe({
      next: () => alert('Estudiante registrado exitosamente.'),
      error: (error) => {
        console.error('Error al registrar el estudiante:', error);
        alert('Ocurrió un error al registrar el estudiante.');
      }
    });
  }
}