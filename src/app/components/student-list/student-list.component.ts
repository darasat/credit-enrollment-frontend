import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { Student } from '../interfaces/Student';
import { CommonModule } from '@angular/common';  // <-- Importar CommonModule

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
  standalone: true,
  imports: [CommonModule] 
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe(
      (students) => {
        this.students = students;
        console.log('Students loaded:', this.students);
      },
      (error) => {
        console.error('Error loading students:', error);
      }
    );
  }
}
