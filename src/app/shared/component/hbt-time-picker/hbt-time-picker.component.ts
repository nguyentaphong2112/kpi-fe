import {
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import { NzDateMode } from 'ng-zorro-antd/date-picker';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { noop } from 'rxjs';

@Component({
  selector: 'hbt-time-picker',
  templateUrl: './hbt-time-picker.component.html',
  styleUrls: ['./hbt-time-picker.component.scss', '../../../core/global-style/_date-picker.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HbtTimePickerComponent),
    }
  ]
})
export class HbtTimePickerComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() labelText: string;
  @Input() autofocus: boolean = false;
  @Input() datePickerIcon: 'search' | 'down' | string;
  @Input() mode: NzDateMode = 'date';
  @Input() placeholderText: string = '';
  @Input() required: boolean;
  @Input() disabled: boolean = false;
  @Input() format: string = 'HH:mm:ss';
  @Input() popupClassName: string = 'popupClassName';
  @Input() errorDefs: { errorName: string, errorDescription: string }[];
  @Input() showIconMessage = true;
  @Input() showError = false;
  @Input() errors: any;
  @Input() type: 'default' | 'warning' | 'error' | 'success' = 'default';
  @Output() readonly onOpenChange = new EventEmitter<boolean>();
  value: any;
  onTouched: () => void = noop;
  onChange: (_: any) => void = noop;
  ngControl?: NgControl;
  inputMessageClass = 'input__message';
  textMessageValue: any;
  showIcon: any;
  iconType: any;
  inputGroupGroupClass = 'datepicker__group--group';
  classGroupGroup = {
    default: 'datepicker__group--group--default',
    warning: 'datepicker__group--group--warning',
    error: 'datepicker__group--group--error',
    success: 'datepicker__group--group--success',
  };
  classMessage = {
    default: 'datepicker__message--default',
    warning: 'datepicker__message--warning',
    error: 'datepicker__message--error',
    success: 'datepicker__message--success'
  };
  classIcon = {
    warning: 'warning',
    error: 'close-circle',
    success: 'check-circle'
  };

  constructor(private inj: Injector) {
  }

  ngOnChanges() {
    this.configInput();
    this.setErrorMessage();
  }

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
  }

  writeValue(obj: any) {
    this.value = obj;
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  openChange($event) {
    this.onOpenChange.emit($event);
  }

  onInputChange($event: any) {
    this.onChange($event);
  }

  configInput() {
    this.inputGroupGroupClass = 'datepicker__group--group' + ' ';
    this.inputMessageClass = 'datepicker__message ' + ' ';
    switch (this.type) {
      case 'default':
        this.inputGroupGroupClass += this.classGroupGroup.default;
        this.inputMessageClass += this.classMessage.default;
        break;
      case 'warning':
        this.inputGroupGroupClass += this.classGroupGroup.warning;
        this.inputMessageClass += this.classMessage.warning;
        this.iconType = this.classIcon.warning;
        break;
      case 'error':
        this.inputGroupGroupClass += this.classGroupGroup.error;
        this.inputMessageClass += this.classMessage.error;
        this.iconType = this.classIcon.error;
        break;
      case 'success':
        this.inputGroupGroupClass += this.classGroupGroup.success;
        this.inputMessageClass += this.classMessage.success;
        this.iconType = this.classIcon.success;
        break;
      default:
        this.inputGroupGroupClass += this.classGroupGroup.default;
        this.inputMessageClass += this.classMessage.default;
        break;
    }
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
