import { HighlightDirective } from './highlight.directive';

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  template: `<div [appHighlight]="true">Test</div>`,
  imports: [HighlightDirective]
})
class TestHostComponent {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should apply highlight style', () => {
    const div = fixture.debugElement.query(By.directive(HighlightDirective));
    expect(div).toBeTruthy();
    expect(div.nativeElement.style.backgroundColor).toBeTruthy();
  });
});
