import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CoursePage } from '../course-page/course-page';
import { MOCK_COURSES } from '../testing/testing-data';
import { courseResolver } from './course.resolver';
import { CoursesService } from './courses.service';

describe('Course Resolver', () => {
  let mockCoursesService: any;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    mockCoursesService = {
      findCourseById: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CoursePage],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService },
        provideRouter([
          {
            path: 'courses/:id',
            component: CoursePage,
            resolve: {
              course: courseResolver,
            },
          },
        ]),
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
  });

  it('should load correct course by Id', async () => {
    // prepara o mock
    mockCoursesService.findCourseById.mockResolvedValueOnce(MOCK_COURSES[0]);
    const component = await harness.navigateByUrl('/courses/1', CoursePage);

    // isto compróbase con 2º param de navigageByUrl
    // expect(component). toBeTruthy();
    // expect(component).toBeInstanceOf(CoursePage)

    expect(TestBed.inject(Router).url).toBe('/courses/1');
    expect(mockCoursesService.findCourseById).toHaveBeenCalledExactlyOnceWith('1');
    expect(component.course()).toEqual(MOCK_COURSES[0]);

    expect(harness.routeNativeElement?.textContent).toContain('Beginner Course');
  });
});
