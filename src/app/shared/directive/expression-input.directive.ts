import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appExpression]'
})
export class ExpressionDirective {
  @Input() decimals = 2;
  @Input() num = 2;


  private check(value: string) {
    const trimmed = String(value).trim();

    const numberPattern = new RegExp(`^\\d{1,${this.num}}(\\.\\d{0,${this.decimals}})?$`);

    const expressionPattern = new RegExp(`^(>=|<=|>|<|=|>= |<= |> |< |= )\\s*\\d{1,${this.num}}(\\.\\d{0,${this.decimals}})?$`);

    return numberPattern.test(trimmed) || expressionPattern.test(trimmed);
  }


  private run(oldValue: any) {
    setTimeout(() => {
      const currentValue: string = this.el.value;
      if (currentValue == null || currentValue.trim() === '') return;


      if (currentValue.trim().length >= 3 && !this.check(currentValue)) {
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

    const operators = ['>', '<', '='];

    if (allowedKeys.includes(event.key)) return;

    const isNumber = /^[0-9]$/.test(event.key);
    const isDot = event.key === '.';
    const isOperator = operators.includes(event.key);


    if (!isNumber && !isDot && !isOperator) {
      event.preventDefault();
    }

    this.run(this.el.value);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    this.run(this.el.value);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    this.run(this.el.value);
  }
}
