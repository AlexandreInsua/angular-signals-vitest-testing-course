import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CoursesService } from '../services/courses.service';
import { getMockLessonsPage, MOCK_COURSES, MOCK_LESSONS } from '../testing/testing-data';
import { clickButton, getTableContent } from '../testing/testing-utils';
import { CoursePage } from './course-page';

// función de utilidade que devolve Lesson[]
const FIRST_PAGE = getMockLessonsPage(1, '', 'asc', 0, 3);
const SECOND_PAGE = getMockLessonsPage(1, '', 'asc', 1, 3);
const SEARCH_RESULT = getMockLessonsPage(1, 'Lesson 20', 'asc', 0, 3);

describe('Course Page', () => {
  let fixture: ComponentFixture<CoursePage>;
  let component: CoursePage;
  let de: DebugElement;
  let mockCoursesService: any;
  beforeEach(() => {
    // isto é un stub
    mockCoursesService = {
      findLessons: vi.fn(),
    };
    TestBed.configureTestingModule({
      imports: [CoursePage],
      providers: [
        // configura o servizo usando o mock
        { provide: CoursesService, useValue: mockCoursesService },
        // na ruta, mockea un valor por defecto
        // se simula o resultado do resolver
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                course: MOCK_COURSES[0],
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursePage);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Non rompe aínda que non setee o servizo no módulo !?
  it('Should component be created', () => {
    expect(component).toBeTruthy();
  });

  // hai que mockear datos na ruta
  // e o resource obterá a lista de lecctions de curso
  it('should load lessons on init', async () => {
    // mockea a resposta do servizo
    // * no meu mundo o resolver traería estos datos na ruta
    mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);
    // devolve unha promesa cando Angular xa non ten tarefas asíncronas pendentes
    // 👉 Agarda a que Angular remate todo. A alternativa é fakeAsync para un control máis granular.
    await fixture.whenStable();
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 0, 3);

    // comproba efectos no dom
    const lessons = getTableContent(de, 'tbody tr td.description-cell');
    expect(lessons).toHaveLength(3);
    // ten sentido isto? non sería mellor testear profundamente?
    expect(lessons[0]).toBe('Lesson 1');
    expect(lessons[1]).toBe('Lesson 2');
    expect(lessons[2]).toBe('Lesson 3');

    // ! De novo está misturando alcance dos tests. O assert do servizo podería ir nunha suite do servizo (ls. 59 - 63)
    // * Idealmente creo que debería limitarse a comprobar só este compoñente
    // * neste caso, o efecto de mockear os datos na ruta
  });

  it('should show the loading spinner while fetching', () => {
    // testea a partir do resuource
    // despara a detección de cambios
    fixture.detectChanges();
    // busca o elemento e comproba que existe
    const spinner = de.query(By.css('.loading-spinner'));
    expect(spinner).toBeTruthy();
    expect(component.loading()).toBe(true);
  });

  it('should navigate to next page', async () => {
    // envia datos
    mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);
    // espera a que estea estabilizado
    await fixture.whenStable();

    // verifica chamada (porque é un mock)
    expect(mockCoursesService.findLessons).toHaveBeenCalledOnce();
    expect(mockCoursesService.findLessons).toHaveBeenCalledWith(1, '', 'asc', 0, 3);
    expect(mockCoursesService.findLessons).toHaveBeenCalledExactlyOnceWith(1, '', 'asc', 0, 3);

    // modificar os datos do mock
    mockCoursesService.findLessons.mockReturnValueOnce(SECOND_PAGE);

    // utilidade de testing para lanzar o evento
    clickButton(de, '.page-controls button:last-child');
    await fixture.whenStable();

    // comprobamos os efectos no dom do
    const lessons = getTableContent(de, 'tbody tr td.description-cell');
    expect(lessons).toHaveLength(3);

    expect(lessons[0]).toBe('Lesson 4');
    expect(lessons[1]).toBe('Lesson 5');
    expect(lessons[2]).toBe('Lesson 6');
  });

  it('should navigate to previous page', async () => {
    // establece unha secuencia de chamadas con cadansúa reposta
    mockCoursesService.findLessons.mockReturnValueOnce(SECOND_PAGE).mockReturnValueOnce(FIRST_PAGE);
    // stable a segunda páxina (e chama ao servizo)
    component.pageIndex.set(1);

    await fixture.whenStable();

    expect(mockCoursesService.findLessons).toHaveBeenCalledOnce();
    expect(mockCoursesService.findLessons).toHaveBeenCalledWith(1, '', 'asc', 1, 3);

    clickButton(de, '.page-controls button:first-child');
    await fixture.whenStable();

    // controla a chamada
    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
    // ! Ollo!, hai que controla a orde da chamada, do contrario hai un falso positivo
    expect(mockCoursesService.findLessons).toHaveBeenNthCalledWith(2, 1, '', 'asc', 0, 3);

    // comprobamos os efectos no dom do
    const lessons = getTableContent(de, 'tbody tr td.description-cell');
    expect(lessons).toHaveLength(3);

    expect(lessons[0]).toBe('Lesson 1');
    expect(lessons[1]).toBe('Lesson 2');
    expect(lessons[2]).toBe('Lesson 3');
  });

  it('should update page size', async () => {
    // carga datos
    mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);
    // estabiliza
    await fixture.whenStable();

    // mockea datos
    mockCoursesService.findLessons.mockReturnValueOnce(getMockLessonsPage(1, '', 'asc', 0, 10));
    // selecciona o elemento nativo
    const selectEl = de.query(By.css('.items-label select')).nativeElement;
    // establece o valor (js)
    selectEl.value = 10;
    // emite un evento (js)
    selectEl.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    // agora os datos debería estar
    expect(component.pageSize()).toBe(10);
    expect(component.pageIndex()).toBe(0);

    // valida o efecto no dom
    const lessons = getTableContent(de, 'tbody tr td.description-cell');
    expect(lessons).toHaveLength(10);

    expect(lessons[0]).toBe('Lesson 1');
    expect(lessons[9]).toBe('Lesson 10');
  });

  it('should toggle sort direction', async () => {
    // mockeamos datos
    mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);
    // estabilizamos
    await fixture.whenStable();
    expect(component.sortDirection()).toBe('asc');

    // mockeamos datos para a orde inversa
    mockCoursesService.findLessons.mockReturnValueOnce(MOCK_LESSONS.reverse().slice(0, 3));
    // lanzamos o evento de click na columna sortable
    clickButton(de, '.sortable');
    // esperamos a que Angular estabilice
    await fixture.whenStable();
    // validamos a chamada ao servizo co novo orden
    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
    // ! Ollo!, hai que controla a orde da chamada, do contrario hai un falso positivo
    expect(mockCoursesService.findLessons).toHaveBeenNthCalledWith(2, 1, '', 'desc', 0, 3);
    // validamos o cambio de estado
    expect(component.sortDirection()).toBe('desc');
    // validamos o efecto no dom
    const lessons = getTableContent(de, 'tbody tr td.description-cell');
    expect(lessons).toHaveLength(3);
    expect(lessons[0]).toBe('Lesson 20');
    expect(lessons[1]).toBe('Lesson 19');
    expect(lessons[2]).toBe('Lesson 18');
  });

  it('should debounce search input by 400ms', async () => {
    // un fakeTimers controla o timers e debounce
    // hai que desactivalos no afterEach
    // activamos o fakeTimers
    vi.useFakeTimers();

    // cargamos datos iniciais
    mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);

    // como estamos usando fakeTimers
    // xestión do tempo é manual
    // debemos detectar os cambios
    fixture.detectChanges();

    // comprobamos as chamada
    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);

    // mockeamos un valor para  procura
    mockCoursesService.findLessons.mockReturnValueOnce(SEARCH_RESULT);
    // simulamos o input
    component.onSearch('Lesson 20');
    // avanzamos ata o momento antes de lanzar a petición
    vi.advanceTimersByTime(399);
    // hai que lanzar a deteccións de cambios
    fixture.detectChanges();
    // comprombamos que foi chamada
    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);
    // avanza 1 ms para comprobar que se fai a petición
    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
    expect(mockCoursesService.findLessons).toHaveBeenCalledWith(1, 'Lesson 20', 'asc', 0, 3);

    // agora hai que exectutar todos os timers pendentes.
    await vi.runAllTimersAsync();

    const lessons = getTableContent(de, 'tbody tr td.description-cell');
    expect(lessons).toHaveLength(1);
    expect(lessons[0]).toBe('Lesson 20');
  });
});
