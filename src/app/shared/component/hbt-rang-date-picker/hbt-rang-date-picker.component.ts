import { Component, EventEmitter, forwardRef, Injector, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { CompatibleDate, DisabledDateFn, NzDateMode, SupportTimeOptions } from 'ng-zorro-antd/date-picker';
import { FunctionProp, NzSafeAny } from 'ng-zorro-antd/core/types';
import { toBoolean } from 'ng-zorro-antd/core/util';
import { noop } from 'rxjs';

@Component({
  selector: 'hbt-rang-date-picker',
  templateUrl: './hbt-rang-date-picker.component.html',
  styleUrls: ['../../../core/global-style/_date-picker.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HbtRangDatePickerComponent),
    }
  ]
})
export class HbtRangDatePickerComponent implements OnInit {
  @Input() labelText: string;
  @Input() autofocus: boolean = false;
  @Input() disabled: boolean = false;
  @Input() inputReadOnly: boolean = false;
  @Input() inline: boolean = false;
  @Input() mode: NzDateMode = 'date';
  @Input() placeholderFromdate: string = null;
  @Input() placeholderTodate: string = null;
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

  value: any[] = [null, null];
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
    // console.log(this.value);
    this.value = obj ?? [null, null];
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

  openChange($event, type: 'START' | 'END') {
    // console.log($event);
    this.onOpenChange.emit($event);
  }

  _onOk($event, type: 'START' | 'END') {
    // console.log($event);
    switch (type) {
      case 'END':
        this.value[1] = $event;
        break;
      case 'START':
        this.value[0] = $event;
        break;
      default:
        return;
    }
    this.onOk.emit(this.value);
    this.writeValue(this.value);
  }

  onInputChange($event: any, type: 'START' | 'END') {
    // console.log($event);
    switch (type) {
      case 'END':
        this.value[1] = $event;
        break;
      case 'START':
        this.value[0] = $event;
        break;
      default:
        return;
    }
    this.onChange($event);
    this.writeValue(this.value);
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
