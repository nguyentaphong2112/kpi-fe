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
import { CompatibleDate, DisabledDateFn, NzDateMode, SupportTimeOptions } from 'ng-zorro-antd/date-picker';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { FunctionProp, NzSafeAny } from 'ng-zorro-antd/core/types';
import { noop } from 'rxjs';
import { InputBoolean, toBoolean } from 'ng-zorro-antd/core/util';

@Component({
  selector: 'hbt-date-picker',
  templateUrl: './hbt-date-picker.component.html',
  styleUrls: ['../../../core/global-style/_date-picker.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HbtDatePickerComponent),
    }
  ]
})
export class HbtDatePickerComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() labelText: string;
  @Input() autofocus = false;
  @Input() datePickerIcon: 'search' | 'down' | string;
  @Input() disabled = false;
  @Input() inputReadOnly = false;
  @Input() inline = false;
  @Input() mode: NzDateMode = 'date';
  @Input() format = 'dd/MM/yyyy';
  @Input() placeholderText = '';
  @Input() suffixIcon: string | TemplateRef<NzSafeAny> = 'calendar';
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() showToday: boolean;
  @Input() disabledTime?: DisabledDateFn;
  @Input() dateRender?: TemplateRef<NzSafeAny> | string | FunctionProp<TemplateRef<Date> | string>;
  @Input() renderExtraFooter?: TemplateRef<NzSafeAny> | string | FunctionProp<TemplateRef<NzSafeAny> | string>;
  private _showTime: SupportTimeOptions | boolean = false;
  @Output() readonly onOpenChange = new EventEmitter<boolean>();
  @Output() readonly onPanelChange = new EventEmitter<NzDateMode | NzDateMode[] | string | string[]>();
  @Output() readonly onCalendarChange = new EventEmitter<Array<Date | null>>();
  @Output() readonly onOk = new EventEmitter<CompatibleDate | null>();
  @Input() errorDefs: { errorName: string, errorDescription: string }[];
  @Input() showIconMessage = true;
  @Input() showError = false;
  @Input() errors: any;
  @Input() type: 'default' | 'warning' | 'error' | 'success' = 'default';

  @Input() get showTime(): SupportTimeOptions | boolean {
    return this._showTime;
  }

  set showTime(value: SupportTimeOptions | boolean) {
    this._showTime = typeof value === 'object' ? value : toBoolean(value);
  }

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
    error: 'warning',
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

  _onOk($event) {
    this.onOk.emit($event);
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
      for (const error of this.errorDefs) {
        const key = error.errorName;
        if (this.errors[key]) {
          this.textMessageValue = error.errorDescription;
        }
      }
    }
  }
}
