import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberInput]'
})
export class NumberInputDirective {
  @Input('appNumberInput') isDisable = false;
  constructor(
    private el: NgControl
  ) {
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    if (!this.isDisable) {
      this.el.control.patchValue(value.replace(/[^0-9]/g, ''));
    }
  }
}
