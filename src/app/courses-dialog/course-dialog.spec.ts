import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldState } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CoursesService } from '../services/courses.service';
import { MOCK_COURSES } from '../testing/testing-data';
import { clickButton } from '../testing/testing-utils';
import { CoursesDialog } from './courses-dialog';

describe('CourseDialog', () => {
  let mockCoursesService: any;
  let mockDialogRef: any;

  let fixture: ComponentFixture<CoursesDialog>;
  let component: CoursesDialog;
  let de: DebugElement;

  beforeEach(() => {
    mockCoursesService = {
      saveCourse: vi.fn().mockResolvedValue({}),
    };

    mockDialogRef = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [CoursesDialog],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: { course: MOCK_COURSES[0] } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesDialog);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should initialize the form with course data', () => {
    expect(component).toBeDefined();
    expect(component.courseForm.description().value()).toBe('Beginner Course');
    expect(component.courseForm.category().value()).toBe('BEGINNER');
    expect(component.courseForm.releasedAt().value()).toBe(new Date().toLocaleDateString('en-CA'));
    expect(component.courseForm.longDescription().value()).toBe('Theory');
    expect(component.courseForm().valid()).toBe(true);
  });

  it('should handle all form fields errors', () => {
    testFieldError(component.courseForm.description(), '.description', 'Description is required');
    testFieldError(component.courseForm.category(), '.category', 'Category is required');
    testFieldError(component.courseForm.releasedAt(), '.released-at', 'Release Date is required');
    testFieldError(
      component.courseForm.longDescription(),
      '.long-description',
      'Description is required',
    );
  });

  it('should call saveCourse and close dialog', async () => {
    component.courseForm.description().value.set('New course title');
    fixture.detectChanges();

    clickButton(de, '.btn-primary');
    await fixture.whenStable();

    expect(mockCoursesService.saveCourse).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        titles: expect.objectContaining({ description: 'New course title' }),
      }),
    );
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  function testFieldError(fieldstate: FieldState<unknown>, selector: string, message: string) {
    fieldstate.value.set('');
    fieldstate.markAsTouched();
    fixture.detectChanges();

    const errorList = de.query(By.css(`${selector} .error-list`));
    expect(errorList).toBeTruthy();
    expect(errorList.nativeElement.textContent).toContain(message);

    const saveBtn = de.query(By.css('.btn-primary'))?.nativeElement;
    expect(saveBtn.disabled).toBe(true);
  }
});
