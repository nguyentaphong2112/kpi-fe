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
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FunctionProp, NzSafeAny } from 'ng-zorro-antd/core/types';
import { CompatibleDate, DisabledDateFn, NzDateMode } from 'ng-zorro-antd/date-picker';
import { noop } from 'rxjs';
import * as moment from 'moment';
import { SYSTEM_FORMAT_DATA } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { addHours, addMinutes, format, parse } from 'date-fns';

@Component({
  selector: 'hbt-date-time-work',
  templateUrl: './hbt-date-time-work.component.html',
  styleUrls: ['../../../core/global-style/_date-picker.scss', './hbt-date-time-work.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HbtDateTimeWorkComponent),
    }
  ]
})
export class HbtDateTimeWorkComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() labelText: string;
  @Input() autofocus: boolean = false;
  @Input() datePickerIcon: 'search' | 'down' | string;
  @Input() disabled: boolean = false;
  @Input() inputReadOnly: boolean = false;
  @Input() inline: boolean = false;
  @Input() mode: NzDateMode = 'date';
  @Input() placeholderText: string = '';
  @Input() placeholderTime: string = '__ : __';
  @Input() suffixIcon: string | TemplateRef<NzSafeAny> = 'calendar';
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() showToday: boolean;
  @Input() disabledTime?: DisabledDateFn;
  @Input() dateRender?: TemplateRef<NzSafeAny> | string | FunctionProp<TemplateRef<Date> | string>;
  @Input() renderExtraFooter?: TemplateRef<NzSafeAny> | string | FunctionProp<TemplateRef<NzSafeAny> | string>;
  @Input() required: boolean;
  @Input() isStartTime: boolean = true;
  @Output() readonly onOpenChange = new EventEmitter<boolean>();
  @Output() readonly onPanelChange = new EventEmitter<NzDateMode | NzDateMode[] | string | string[]>();
  @Output() readonly onCalendarChange = new EventEmitter<Array<Date | null>>();
  @Output() readonly onOk = new EventEmitter<CompatibleDate | null>();
  @Input() errorDefs: { errorName: string, errorDescription: string }[];
  @Input() showIconMessage = true;
  @Input() showError = false;
  @Input() errors: any;
  @Input() type: 'default' | 'warning' | 'error' | 'success' = 'default';
  selectedTime = null;
  selectedDate = null;
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
  timeStart = [
    { value: '08:00', label: '08:00' },
    { value: '13:30', label: '13:30' },
  ];
  timeEnd = [
    { value: '12:00', label: '12:00' },
    { value: '17:30', label: '17:30' },
  ];

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
    this.selectedTime = obj ? moment(obj, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT).format('HH:mm') : '';
    this.value = obj ? moment(obj, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT).toDate() : null;
    this.selectedDate = this.value;
    this.onChange(obj);
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
    this.selectedDate = $event;
    if (!this.selectedTime) {
      const datasource = this.isStartTime ? this.timeStart : this.timeEnd;
      this.selectedTime = this.isStartTime ? datasource[0].value : datasource[1].value;
    }
    this._handleOnChange($event, this.selectedTime);
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
    if (this.errors && this.errorDefs) {
      for (let error of this.errorDefs) {
        let key = error.errorName;
        if (this.errors[key]) {
          this.textMessageValue = error.errorDescription;
        }
      }
    }
  }

  /**
   * changeTime
   * @param evt
   */
  changeTime(evt) {
    this.selectedTime = evt.listOfSelected;
    this._handleOnChange(this.selectedDate, this.selectedTime);
  }

  /**
   * _getDetailTime
   * @param strTime
   * @returns
   */
  _getDetailTime(strTime) {
    if (CommonUtils.isNullOrEmpty(strTime)) {
      return {};
    }
    const arr = strTime.split(':');
    return {
      hour: parseInt(arr[0]),
      minute: parseInt(arr[1]),
    };
  }

  /**
   * _handleOnChange
   * @param date
   * @param time
   */
  _handleOnChange(date: Date, time) {
    if (!date || !time) {
      this.selectedDate = null;
      this.selectedTime = null;
      this.onChange(null);
      return;
    }
    const { hour, minute } = this._getDetailTime(time);
    const momentDate = moment(date).set({ hour: hour, minute: minute, second: 0 }).toDate();
    this.selectedDate = momentDate;
    this.onChange(format(momentDate, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT));
  }
}
