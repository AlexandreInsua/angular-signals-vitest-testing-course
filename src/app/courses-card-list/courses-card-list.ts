import { Dialog } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CoursesDialog } from '../courses-dialog/courses-dialog';
import { Course } from '../model/course';

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.html',
  styleUrl: './courses-card-list.scss',
  imports: [RouterLink],
})
export class CoursesCardList {
  courses = input.required<Course[]>();
  courseEdited = output();

  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  editCourse(course: Course) {
    const dialogRef = this.dialog.open(CoursesDialog, {
      width: '500px',
      data: { course },
    });

    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        console.log({ result });
        this.courseEdited.emit();
      }
    });
  }
}
