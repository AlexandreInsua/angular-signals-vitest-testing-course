import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { Course, CourseData } from '../model/course';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'courses-dialog',
  imports: [FormField],
  templateUrl: './courses-dialog.html',
  styleUrl: './courses-dialog.scss',
})
export class CoursesDialog {
  private coursesService = inject(CoursesService);
  private dialogRef = inject(DialogRef<Course>);
  public data = inject<{ course: Course }>(DIALOG_DATA);

  // modelo para crear un formulario
  courseModel = signal<CourseData>({
    description: this.data.course.titles.description ?? '',
    category: this.data.course.category ?? '',
    releasedAt: new Date().toISOString().split('T')[0],
    longDescription: this.data.course.titles.longDescription ?? '',
  });

  // formulario baseado no modelo, con validacións
  courseForm = form(this.courseModel, (schemaPath) => {
    required(schemaPath.description, { message: 'Description is required' });
    required(schemaPath.category, { message: 'Category is required' });
    required(schemaPath.releasedAt, { message: 'Release Date is required' });
    required(schemaPath.longDescription, { message: 'Long Description is required' });
  });

  close() {
    this.dialogRef.close();
  }

  async save() {
    await submit(this.courseForm, async (f) => {
      const val = f().value();

      const changes: Partial<Course> = {
        category: val.category as any,
        titles: {
          description: val.description,
          longDescription: val.longDescription,
        },
      };

      try {
        await this.coursesService.saveCourse(this.data.course.id, changes);
        this.dialogRef.close(val as any);
      } catch (err) {
        console.error('Save failed', err);
      }
    });
  }
}
