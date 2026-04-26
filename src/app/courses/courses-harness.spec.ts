import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { CoursesService } from '../services/courses.service';
import { TabsHarness } from '../tabs/tabs.harness';
import { MOCK_COURSES } from '../testing/testing-data';
import { Courses } from './courses';

describe.only('Courses component', () => {
  let fixture: ComponentFixture<Courses>;
  let component: Courses;
  let de: DebugElement;
  let httpMock: HttpTestingController;
  let tabs: TabsHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Courses],
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Courses);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    httpMock = TestBed.inject(HttpTestingController);

    //
    const loader = TestbedHarnessEnvironment.loader(fixture);
    //
    tabs = await loader.getHarness(TabsHarness);

    fixture.detectChanges();
  });

  it('should create the compoment', () => {
    expect(component).toBeTruthy();
  });

  // ! NB: este text non é unitario, senón de integración, acopla o compoñenente e o servizo
  // ? IMO: habería que separar o testing do servizo no seu propio ficheiro
  it('should load courses and filter by category', async () => {
    // verifica a chamada a un endpoint, que se fixo unha única chamada a un endpoint
    // devolve a representación dunha petición
    const request = httpMock.expectOne('/api/courses');
    // simula a resolución da petición
    request.flush({ payload: MOCK_COURSES });
    // as ops anteriores son async
    // cómpre que o SUT agarde que se resolvan
    await fixture.whenStable();
    // aplicar cambios no compoñentes
    fixture.detectChanges();
    // comprobar os efectos
    const titles = de.queryAll(By.css('.course-card .card-header'));
    expect(titles).toHaveLength(1);
    const titleEl = titles[0].nativeElement;
    expect(titleEl.textContent).toBe('Beginner Course');
    // comproba que todas as chamadas se consumiron
    httpMock.verify();
  });

  it('should show advances courses when tab clicked', async () => {
    // ! A repetición do código apoia o comentario anterior
    const request = httpMock.expectOne('/api/courses');
    request.flush({ payload: MOCK_COURSES });
    await fixture.whenStable();
    fixture.detectChanges();
    // recupera o bóton
    const btn = de.query(By.css('.tab-link:last-child'));
    // emite o evento
    btn.nativeElement.click();
    // detecta os cambios
    fixture.detectChanges();

    // comproba os efectos
    const titles = de.queryAll(By.css('.course-card .card-header'));
    expect(titles).toHaveLength(1);
    const titleEl = titles[0].nativeElement;
    expect(titleEl.textContent).toBe('Advanced Course');
    // comproba que todas as chamadas se consumiron
    httpMock.verify();
  });

  // no exemplo mete este código, pero eu non podo pq teño o 1º test
  // afterEach(() => {
  //   httpMock.verify();
  // });
});
