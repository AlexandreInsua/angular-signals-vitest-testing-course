import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HelloWorld } from './hello-world';

describe('Hello World', () => {
  // representación do compoñente
  let fixture: ComponentFixture<HelloWorld>;
  // representación do elemento do dom
  let de: DebugElement;
  // representación do nodo no html
  let el: HTMLElement;

  let component: HelloWorld;

  beforeEach(async () => {
    // wrapper de angular
    await TestBed.configureTestingModule({
      imports: [HelloWorld],
    });

    // Resolver recursos del componente
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(HelloWorld);
    de = fixture.debugElement;
    el = de.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeDefined();
  });
  it('should display the message', () => {
    const h1 = el.querySelector('h1');
    expect(h1).toBeDefined();
    expect(h1?.textContent).toEqual(component.message);
  });
});
