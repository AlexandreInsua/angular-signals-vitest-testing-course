import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
    // O debug element é a representación do elemento do dom dentro do contexto de Angular,
    // é dicir, ten acceso a propiedades e métodos do compoñente.
    // e tamén permite acceder a elementos do DOM e disparar eventos.
    de = fixture.debugElement;
    // disparase a detección de cambios
    fixture.detectChanges();
  });

  // forma estándar para verificacion que o setup está correctamente configurado.
  it('should create the tabs component', () => {
    expect(component).toBeTruthy();
  });

  // testea o correcto número de tabs: cada tab é un botón
  it('should render the correct tabs component', () => {
    // By é unha utilidade de testing  de Angular que permite crear predicados
    // para buscar elementos no DOM a través de selectores CSS, directivas,
    const buttons = de.queryAll(By.css('.tab-link'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent.trim()).toEqual('Beginner');
    expect(buttons[1].nativeElement.textContent.trim()).toEqual('Advanced');
  });

  it('should apply the active class to the selected tab', () => {
    // establece a 2ª tab como activa e dispara a detección de cambios
    fixture.componentRef.setInput('activeTab', 'advanced');
    fixture.detectChanges();
    // busca o elemento a través do obxecto de utilidades de testing
    const button = de.query(By.css('.tab-link:last-child'));
    // valida que o elemento nativo do dom contén a clase active na lista de clases
    expect(button.nativeElement.classList).toContain('active');
  });

  // verifica o cambio de estado: model
  // un writable signal, computed linked signal tamén se validad polo se valor
  it('should emit activeTab when a tab is clicked', () => {
    const button = de.query(By.css('.tab-link:last-child'));
    // lanza un evento no elemento nativo
    button.nativeElement.click();
    // dispara a detección de cambios
    fixture.detectChanges();
    // valida o valor do model
    expect(component.activeTab()).toBe('advanced');
  });

  // valida un output
  it('should emit tabChanged when a tab is clicked', () => {
    // usa un spy
    const emitSyp = vi.spyOn(component.tabChanged, 'emit');
    const button = de.query(By.css('.tab-link:last-child'));
    button.nativeElement.click();
    fixture.detectChanges();
    expect(emitSyp).toHaveBeenCalledExactlyOnceWith('advanced');
  });
});
