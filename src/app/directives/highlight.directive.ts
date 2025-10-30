import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  @Input('appHighlight') active = false;
  @HostBinding('class.hl') base = true;
  @HostBinding('class.active') get isActive() { return this.active || this.hover; }

  private hover = false;

  @HostListener('mouseenter') onEnter() { this.hover = true; }
  @HostListener('mouseleave') onLeave() { this.hover = false; }
}
