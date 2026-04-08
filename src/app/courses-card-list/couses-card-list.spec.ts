import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { CoursesDialog } from '../courses-dialog/courses-dialog';
import { MOCK_COURSES } from '../testing/testing-data';
import { CoursesCardList } from './courses-card-list';

let fixture: ComponentFixture<CoursesCardList>;
let component: CoursesCardList;
let de: DebugElement;

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [CoursesCardList, CoursesDialog],
    providers: [provideRouter([])],
  }).compileComponents();

  fixture = TestBed.createComponent(CoursesCardList);
  component = fixture.componentInstance;
  de = fixture.debugElement;
  fixture.componentRef.setInput('courses', MOCK_COURSES);
  fixture.detectChanges();
});

describe('Courses Card List', () => {
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // controlamos non a asignación do input,
  // senón polo seus efectos
  it('should display the course list', () => {
    const cardTitles = de.queryAll(By.css('.course-card .card-header'));
    expect(cardTitles.length).toBe(2);
    const titleEl = cardTitles[0].nativeElement;
    expect(titleEl.textContent).toBe('Beginner Course');
  });

  // controlar o caso de 0 cursos
  // no pai, debería controlar que [] é o valor por defecto
  it('should display the message when course list is empty', () => {
    fixture.componentRef.setInput('courses', []);
    fixture.detectChanges();
    const noCoursesMessage = de.query(By.css('.no-courses'));
    expect(noCoursesMessage).toBeTruthy();
    expect(noCoursesMessage.nativeElement.textContent).toBe('No courses found.');
  });

  // outra vez, comprobamos o resultado da interacción,
  // non a pila de chamadas
  it('should open dialog when clicking the edit button', () => {
    const btn = de.query(By.css('.course-card:first-child button'));
    btn.nativeElement.click();
    fixture.detectChanges();

    const form = document.querySelector('.course-form');
    expect(form, 'the form should be visible').toBeTruthy();
  });
});
