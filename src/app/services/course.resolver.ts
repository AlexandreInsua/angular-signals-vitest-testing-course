import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Course } from '../model/course';
import { CoursesService } from './courses.service';

export const courseResolver: ResolveFn<Course> = (
  route: ActivatedRouteSnapshot,
): Promise<Course> => {
  const coursesService = inject(CoursesService);

  return coursesService.findCourseById(route.params['id']);
};
