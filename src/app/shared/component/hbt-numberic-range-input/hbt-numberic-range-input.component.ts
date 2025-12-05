import { Component, EventEmitter, forwardRef, Injector, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { noop } from 'rxjs';
import { InputBoolean } from 'ng-zorro-antd/core/util';

@Component({
  selector: 'hbt-numberic-range-input',
  templateUrl: './hbt-numberic-range-input.component.html',
  styleUrls: ['./hbt-numberic-range-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HbtNumbericRangeInputComponent),
    }
  ]
})
export class HbtNumbericRangeInputComponent implements OnInit {
  @Input() labelText: string;
  @Input() @InputBoolean() disable = false;
  @Input() placeholderMin: string = 'Từ';
  @Input() placeholderMax: string = 'Đến';
  @Input() maxNumOfMax = 100;
  @Input() maxDecimalOfMax = 0;
  @Input() maxNumOfMin = 100;
  @Input() maxDecimalOfMin = 0;
  @Input() showError = false;
  @Input() errors: any;
  @Input() showIconMessage = true;
  @Input() type: 'default' | 'warning' | 'error' | 'success' = 'default';
  @Input() errorDefs: { errorName: string, errorDescription: string }[];
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  inputMessageClass = 'input__message';
  textMessageValue: any;
  iconType: any;
  value: any[] = [null, null];
  onTouched: () => void = noop;
  onChange: (_: any) => void = noop;
  ngControl?: NgControl;
  classMessage = {
    default: 'input__message--default',
    warning: 'input__message--warning',
    error: 'input__message--error',
    success: 'input__message--success'
  };
  classIcon = {
    warning: 'warning',
    error: 'warning',
    success: 'check-circle'
  };

  constructor(private inj: Injector) {
  }

  configInput() {
    switch (this.type) {
      case 'default':
        this.inputMessageClass += this.classMessage.default;
        break;
      case 'warning':
        this.inputMessageClass += this.classMessage.warning;
        this.iconType = this.classIcon.warning;
        break;
      case 'error':
        this.inputMessageClass += this.classMessage.error;
        this.iconType = this.classIcon.error;
        break;
      case 'success':
        this.inputMessageClass += this.classMessage.success;
        this.iconType = this.classIcon.success;
        break;
      default:
        this.inputMessageClass += this.classMessage.default;
        break;
    }
  }

  ngOnChanges() {
    this.configInput();
    this.setErrorMessage();
  }

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  writeValue(obj: any): void {
    // console.log(this.value);
    this.value = obj ?? [null, null];
    this.onChange(this.value);
  }

  onInputChange($event: any, type: 'MIN' | 'MAX') {
    // console.log($event);
    switch (type) {
      case 'MIN':
        this.value[0] = $event;
        break;
      case 'MAX':
        this.value[1] = $event;
        break;
      default:
        return;
    }
    this.writeValue(this.value);
  }

  inputBlur($event: any) {
    this.onTouched();
    this.blur.emit($event);
  }

  setErrorMessage() {
    if (this.errors) {
      for (let error of this.errorDefs) {
        let key = error.errorName;
        if (this.errors[key]) {
          this.textMessageValue = error.errorDescription;
        }
      }
    }
  }
}
