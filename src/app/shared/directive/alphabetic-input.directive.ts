import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAlphabeticInput]'
})
export class AlphabeticInputDirective {
  constructor(
    private el: NgControl
  ) {
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.el.control.patchValue(value.replace(/[&\/\\#,+()$~%.'":*?<>{}@\-_0-9]/g, ''));
  }
}
