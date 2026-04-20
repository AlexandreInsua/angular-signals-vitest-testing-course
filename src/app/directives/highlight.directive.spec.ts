import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { HighlightDirective } from './highlight.directive';

@Component({
  imports: [HighlightDirective],
  template: `<div id="default-highlight" appHighlight>Default Color</div>
    <div id="custom-highlight" appHighlight highlightColor="rgb(0, 0, 255)">Custom Color</div>
    <div id="no-highlight">No Directive</div>`,
})
class TestHostComponent {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement;
  let defaultHighlight: any;
  let customHighlight: any;
  let noHighlight: any;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    debugElement = fixture.debugElement;

    fixture.detectChanges();
    defaultHighlight = debugElement.query(By.css('#default-highlight')).nativeElement;
    customHighlight = debugElement.query(By.css('#custom-highlight')).nativeElement;
    noHighlight = debugElement.query(By.css('#no-highlight')).nativeElement;
  });

  it('should have found all elements', () => {
    expect(defaultHighlight).toBeTruthy();
    expect(customHighlight).toBeTruthy();
    expect(noHighlight).toBeTruthy();
  });

  it('should highlight when mouse over, clear when mouse leaves', () => {
    defaultHighlight.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(defaultHighlight.style.backgroundColor).toBe('rgb(0, 128, 0)');

    defaultHighlight.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    expect(defaultHighlight.style.backgroundColor).toBe('');
  });

  it('should apply custom color', () => {
    customHighlight.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    expect(customHighlight.style.backgroundColor).toBe('rgb(0, 0, 255)');
  });

  it('should not affect elements without the directive', () => {
    noHighlight.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(noHighlight.style.backgroundColor).toBe('');
  });
});
