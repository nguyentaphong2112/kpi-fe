import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[uppercase]',
})
export class UppercaseInputDirective {
  lastValue: string;

  constructor(public ref: ElementRef) {
  }

  @HostListener('input', ['$event'])
  onInput($event) {
    let start = $event.target.selectionStart;
    let end = $event.target.selectionEnd;
    $event.target.value = $event.target.value.toUpperCase();
    $event.target.setSelectionRange(start, end);
    $event.preventDefault();
    if (
      !this.lastValue ||
      (this.lastValue && $event.target.value.length > 0 && this.lastValue !== $event.target.value)
    ) {
      this.lastValue = this.ref.nativeElement.value = $event.target.value;
      // Propagation
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', false, true);
      event.target.dispatchEvent(evt);
    }
  }

  @HostListener('blur', ['$event'])
  onBlur($event) {
    let start = $event.target.selectionStart;
    let end = $event.target.selectionEnd;
    $event.target.value = $event.target.value.trim();
    $event.target.setSelectionRange(start, end);
    $event.preventDefault();
    if (
      !this.lastValue ||
      (this.lastValue && $event.target.value.length > 0 && this.lastValue !== $event.target.value)
    ) {
      this.lastValue = this.ref.nativeElement.value = $event.target.value;
      // Propagation
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', false, true);
      event.target.dispatchEvent(evt);
    }
  }
}
