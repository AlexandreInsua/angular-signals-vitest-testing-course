import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { MOCK_TABS } from '../testing/testing-data';
import { TabsComponent } from './tabs';
import { TabData } from './tabs.model';

describe('Tabs Component', () => {
  // declaración do wrapper de texting
  let fixture: ComponentFixture<TabsComponent>;
  // declaracion compoñente (como clase de js )
  let component: TabsComponent;
  // datos falsos para inicializar o input requirido
  const mockTabs: TabData[] = MOCK_TABS;

  let de: DebugElement;

  // configuración do setup
  beforeEach(async () => {
    // wrapper míninimo de angualr
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
    }).compileComponents();

    // instanciación do compoñente dentro do contexto de Angular
    fixture = TestBed.createComponent(TabsComponent);
    // instantación da clase
    component = fixture.componentInstance;
    // inicializacion do input requerido.
    // non inicializalo implica erro
    fixture.componentRef.setInput('tabs', mockTabs);
    //
    de = fixture.debugElement;
    // disparase a detección de cambios
    fixture.detectChanges();
  });

  // forma estándar para verificacion que o setup está correctamente configurado.
  it('should create the tabs component', () => {
    expect(component).toBeTruthy();
  });

  // testea o correcto número de tabs
  it('should render the correct tabs component', () => {
    const buttons = de.queryAll(By.css('.tab-link'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent.trim()).toEqual('Beginner');
    expect(buttons[1].nativeElement.textContent.trim()).toEqual('Advanced');
  });
});
