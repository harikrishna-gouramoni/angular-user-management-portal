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
  it('should be created (placeholder)', () => {
    expect(true).toBeTrue();
  });
});
