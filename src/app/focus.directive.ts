import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[initfocus]',
  exportAs: 'initfocus',
})
export class FocusDirective implements AfterViewInit {

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
    });
  }
}
