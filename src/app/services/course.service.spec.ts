import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Course } from '../model/course';
import { createCourse, MOCK_COURSES } from '../testing/testing-data';
import { CoursesService } from './courses.service';

describe('CoursesService', () => {
  // representación do servizo
  let service: CoursesService;

  // Peza de código que permite simular e completar peticións
  let httpTestingController: HttpTestingController;

  // A configuración do servizo faise diferente do compoñente
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoursesService, provideHttpClient(), provideHttpClientTesting()],
    });
    // O servizo non se crea, senón que se inxecta
    service = TestBed.inject(CoursesService);
    // o controllador de testing http, tamén se inxecta
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // como trata de peticións http que se van simular
    // hai que validar que non hai ningunha colgando pendente do completa
    httpTestingController.verify();
  });

  // * Este test non o crea
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load all courses', async () => {
    // Hai que comprobar que se fai a chamada
    // simular que se recibe un valor
    // e comprobar que o valor obtido se incorpora ao estado da app

    // excuta a chamada
    const resultPromise = service.findAllCourses();
    // intercepta a petición contra endpoint
    const req = httpTestingController.expectOne('/api/courses');
    // valida o verbo http
    expect(req.request.method).toBe('GET');
    // completa a petición enviando o resultado
    req.flush({ payload: MOCK_COURSES });
    // estrae o resolve da promesa
    const courses = await resultPromise;
    // valida que é o que se resolveu
    expect(courses).toBe(MOCK_COURSES);
    // finalmente, verifica que o estado corresponde coa resposta
    expect(service.allCourses()).toBe(MOCK_COURSES);
  });

  it('should find a course', async () => {
    // executa a chamada
    const resultPromise = service.findCourseById(1);
    // intercepta a petición contra endpoint
    const req = httpTestingController.expectOne(`/api/courses/${1}`);
    // valida o verbo http
    expect(req.request.method).toBe('GET');
    // completa a petición
    req.flush(MOCK_COURSES[0]);
    // extrae resultado
    const course = await resultPromise;
    // valida resultado
    expect(course.id).toBe(1);
    expect(course.titles.description).toBe('Beginner Course');
    // non hai estado que validar no servizo
  });

  it('should find lessons with correct query params', async () => {
    // executa a chamada
    const resultPromise = service.findLessons(12, 'filter-text', 'desc', 2, 10);
    // intercepta a petición contra endpoint
    // neste caso, a URL é fixa, pero os parámetros son dinámicos,
    // así que hai que usar unha función para extraer a petición
    // const req = httpTestingController.expectOne('/api/lessons');
    const req = httpTestingController.expectOne((req) => req.url === '/api/lessons');
    // para validar os parámetros, hai que extraelos da petición
    const params = req.request.params;
    // valida os parámetros
    expect(params.get('courseId')).toBe('12');
    expect(params.get('filter')).toBe('filter-text');
    expect(params.get('sortOrder')).toBe('desc');
    expect(params.get('pageNumber')).toBe('2');
    expect(params.get('pageSize')).toBe('10');
    // valida o verbo http
    expect(req.request.method).toBe('GET');

    const mockLessons = {
      payload: [{ id: 12, description: 'Lesson 12', duration: '10:00', courseId: 1 }],
    };
    // completa a petición
    req.flush(mockLessons);
    // extrae resultado
    const lessons = await resultPromise;
    // valida resultado
    expect(lessons).toBe(mockLessons.payload);
  });

  it('should save a course', async () => {
    // mock data
    const course1 = createCourse({ id: 1, titles: { description: 'Initial Title' } });
    const course2 = createCourse({ id: 2, titles: { description: 'Another Course' } });

    // carga datos iniciais
    const saveResultPromise = service.findAllCourses();
    const saveReq = httpTestingController.expectOne('/api/courses');
    expect(saveReq.request.method).toBe('GET');
    saveReq.flush({ payload: [course1, course2] });
    await saveResultPromise;

    // perpara datos para actualización
    const changes: Partial<Course> = { titles: { description: 'Updated Title' } };
    // executa a chamada
    const updateResultPromise = service.saveCourse(1, changes);
    // intercepta a petición contra endpoint
    const updateReq = httpTestingController.expectOne(`/api/courses/${1}`);
    // valida o verbo http
    expect(updateReq.request.method).toBe('PUT');
    // valida o corpo da petición
    expect(updateReq.request.body).toEqual(changes);

    // completa a petición
    updateReq.flush({ ...course1, ...changes });
    // extrae resultado
    const updatedCourse = await updateResultPromise;
    // valida estado actualizado
    const allCourses = service.allCourses();
    expect(allCourses[0].titles.description).toBe('Updated Title');
    expect(allCourses[1].titles.description).toBe('Another Course');
  });
});
