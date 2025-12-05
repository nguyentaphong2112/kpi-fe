import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberic]'
})
export class NumbericDirective {
  @Input() decimals = 2;
  @Input() num = 2;

  private check(value: string) {
    const trimmed = String(value).trim();
    if (this.decimals <= 0) {
      const numberPattern = new RegExp(/^\d+$/);
      return numberPattern.test(trimmed);
    } else {
      const numberPattern = new RegExp(`^\\d{1,${this.num}}(\\.\\d{0,${this.decimals}})?$`);
      return numberPattern.test(trimmed);
    }
  }

  private run(oldValue: any) {
    setTimeout(() => {
      const currentValue: string = this.el.value;
      if (currentValue == null || currentValue.toString().trim() === '') return;


      if (!this.check(currentValue)) {
        this.el.control.patchValue(oldValue);
      }
    });
  }

  constructor(private el: NgControl) {
  }

  @HostListener('keydown', ['$event'])
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', 'Home', 'End'
    ];

    if (allowedKeys.includes(event.key)) return;

    const isNumber = /^[0-9]$/.test(event.key);
    const isDot = event.key === '.';
    if (!isNumber && !isDot) {
      event.preventDefault();
    }
    this.run(this.el.value);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    this.run(this.el.value);
  }

  @HostListener('blur', ['$event'])
  onBlur(event) {
    this.run(this.el.value);
  }
}
