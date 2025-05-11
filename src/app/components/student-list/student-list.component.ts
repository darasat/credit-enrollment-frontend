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
      this.updatePagedStudents();
  }

loadStudents(): void {
  this.studentService.getAllStudents().subscribe(
    (students) => {
      this.students = students;
      console.log('Students loaded:', this.students);
      this.updatePagedStudents(); // ✅ Mover aquí
    },
    (error) => {
      console.error('Error loading students:', error);
    }
  );
}


pagedStudents: Student[] = [];

currentPage = 1;
pageSize = 5;

get totalPages(): number {
  return Math.ceil(this.students.length / this.pageSize);
}


updatePagedStudents() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  this.pagedStudents = this.students.slice(startIndex, startIndex + this.pageSize);
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updatePagedStudents();
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePagedStudents();
  }
}

}
