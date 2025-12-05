import {
  Component, ElementRef,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef, ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { noop } from 'rxjs';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { NzAutocompleteComponent } from 'ng-zorro-antd/auto-complete';
import { DecimalPipe } from '@angular/common';

export class ModelInput {
  groupType?: 'noIcon' | 'icon' | 'textarea' = 'noIcon';
  type?: 'default' | 'warning' | 'error' | 'success' = 'default';
  labelText?: string;
  textMessageValue?: string;
  showIcon?: boolean = true;
  placeholder?: string = '';
  suffixIcon?: 'search' | 'down' | string = null;
  prefixIcon?: 'search' | 'down' | string = null;
  prefixTemplate?: string | TemplateRef<any>;
  suffixTemplate?: string | TemplateRef<any>;
  autoSize?: { [key: string]: number } | boolean = true;
  rows?: number;
  resize?:boolean;
  disable?: boolean;
  autofocus?: 'autofocus' | null; // Chưa hoạt động
  showFlexEnd?: boolean = true;
  showError?: boolean = false;
}

@Component({
  selector: 'hbt-input-text',
  templateUrl: './hbt-input-text.component.html',
  styleUrls: ['../../../core/global-style/_input.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HbtInputTextComponent)
    }/*,
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => HbtInputTextComponent),
      multi: true
    }*/
  ]
})
export class HbtInputTextComponent implements OnInit, ControlValueAccessor, OnChanges { // , Validator {
  @Input() dataSource: string[] = [];
  @Input() config: ModelInput = new ModelInput();
  @Input() labelText: string;
  @Input() defaultInput = false;
  @Input() prefixIcon: 'search' | 'calendar' | 'user';
  @Input() suffixIcon: 'down' | 'eye' | 'key';
  @Input() prefixTemplate: string | TemplateRef<any>;
  @Input() suffixTemplate: string | TemplateRef<any>;
  @Input() placeholderText = '';
  @Input() @InputBoolean() disable = false;
  @Input() @InputBoolean() resize = true;
  @Input() autofocus = false;
  @Input() type: 'default' | 'warning' | 'error' | 'success';
  @Input() @InputBoolean() isTextAre = false;
  @Input() showFlexEnd = true;
  @Input() errorDefs: { errorName: string, errorDescription: string }[];
  @Input() showIconMessage = true;
  @Input() showError = false;
  @Input() errors: any;
  @Input() maxLength: number = 10000000000000;
  @Input() minLength: number = 0;
  @Input() @InputBoolean() required = false;
  @Input() @InputBoolean() readOnly = false;
  @Input() autocomplete: NzAutocompleteComponent;
  @Input() inputType: 'text' | 'password' | 'number' = 'text';
  @Input() isTrim = true;
  @Input() @InputBoolean() isFormatterCurrency = false;
  @Input() minNumber = '';
  @Input() maxNumber = 1000000000000000000;
  @Input() integerPart = 20;
  @Input() decimalPart = 0;
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() keyup: EventEmitter<any> = new EventEmitter<any>();
  @Output() click: EventEmitter<any> = new EventEmitter<any>();
  inputGroupClass = 'input__group';
  inputGroupGroupClass = 'input__group--group';
  inputTextClass = 'input__text';
  inputMessageClass = 'input__message';
  classGroup = {
    noIcon: 'input__group--no-icon',
    icon: 'input__group--icon'
  };
  classGroupGroup = {
    default: 'input__group--group--default',
    warning: 'input__group--group--warning',
    error: 'input__group--group--error',
    success: 'input__group--group--success'
  };
  classInput = {
    default: 'input__text--default',
    warning: 'input__text--warning',
    error: 'input__text--error',
    success: 'input__text--success'
  };
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
  onTouched: () => void = noop;
  onChange: (_: any) => void = noop;
  ngControl?: NgControl;
  iconType: string;
  value: any;
  filteredOptions: string[] = [];

  constructor(
    private inj: Injector, private decimalPipe: DecimalPipe
  ) {
    this.inputGroupClass = 'input__group' + ' ';
    this.inputGroupGroupClass = 'input__group--group' + ' ';
    this.inputTextClass = 'input__text' + ' ';
    this.inputMessageClass = 'input__message ' + ' ';
  }

  ngOnInit() {
    this.ngControl = this.inj.get(NgControl);
  }

  ngOnChanges() {
    this.inputGroupClass = 'input__group' + ' ';
    this.inputGroupGroupClass = 'input__group--group' + ' ';
    this.inputTextClass = 'input__text' + ' ';
    this.inputMessageClass = 'input__message ' + ' ';
    this.setConfig();
    this.configInput();
    this.setErrorMessage();
  }

  setConfig() {
    if (this.type) {
      this.config.type = this.type;
    }
    if (this.labelText) {
      this.config.labelText = this.labelText;
    }
    if (this.placeholderText) {
      this.config.placeholder = this.placeholderText;
    }
    this.config.disable = this.disable;
    this.config.resize = this.resize;
    if (this.prefixIcon) {
      this.config.groupType = 'icon';
      this.config.prefixIcon = this.prefixIcon;
    }
    if (this.prefixTemplate) {
      this.config.groupType = 'icon';
      this.config.prefixTemplate = this.prefixTemplate;
    }
    if (this.suffixIcon) {
      this.config.groupType = 'icon';
      this.config.suffixIcon = this.suffixIcon;
    }
    if (this.suffixTemplate) {
      this.config.groupType = 'icon';
      this.config.suffixTemplate = this.suffixTemplate;
    }
    if (this.autofocus) {
      this.config.autofocus = 'autofocus';
    }
    if (this.isTextAre) {
      this.config.groupType = 'textarea';
    }
    if (!this.showFlexEnd) {
      this.config.showFlexEnd = this.showFlexEnd;
    }
    this.config.showError = this.showError;
    this.config.showIcon = this.showIconMessage;
  }

  configInput() {
    if (this.config?.groupType === 'icon') {
      this.inputGroupClass += this.classGroup.icon;
    } else {
      this.inputGroupClass += this.classGroup.noIcon;
    }
    switch (this.config?.type) {
      case 'default':
        this.inputGroupGroupClass += this.classGroupGroup.default;
        this.inputTextClass += this.classInput.default;
        this.inputMessageClass += this.classMessage.default;
        break;
      case 'warning':
        this.inputGroupGroupClass += this.classGroupGroup.warning;
        this.inputTextClass += this.classInput.warning;
        this.inputMessageClass += this.classMessage.warning;
        this.iconType = this.classIcon.warning;
        break;
      case 'error':
        this.inputGroupGroupClass += this.classGroupGroup.error;
        this.inputTextClass += this.classInput.error;
        this.inputMessageClass += this.classMessage.error;
        this.iconType = this.classIcon.error;
        break;
      case 'success':
        this.inputGroupGroupClass += this.classGroupGroup.success;
        this.inputTextClass += this.classInput.success;
        this.inputMessageClass += this.classMessage.success;
        this.iconType = this.classIcon.success;
        break;
      default:
        this.inputGroupGroupClass += this.classGroupGroup.default;
        this.inputTextClass += this.classInput.default;
        this.inputMessageClass += this.classMessage.default;
        break;
    }
  }

  setErrorMessage() {
    if (this.errors) {
      for (let error of this.errorDefs) {
        let key = error.errorName;
        if (this.errors[key]) {
          this.config.textMessageValue = error.errorDescription;
        }
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
    this.config.disable = isDisabled;
  }

  writeValue(obj: any): void {
    this.value = obj;
    try {
      this.onChange((this.inputType === 'text' && this.isTrim) ? this.value?.trim() : this.value);
    } catch {
      this.onChange(this.value)
    }
  }

  onInputChange($event: any) {
    this.filteredOptions = this.dataSource?.filter(item => item?.toLowerCase().indexOf($event?.toLowerCase()) !== -1) ?? [];
    try {
      this.onChange((this.inputType === 'text' && this.isTrim) ? $event?.trim() : $event);
    } catch {
      this.onChange($event);
    }
  }

  inputBlur($event: any) {
    this.onTouched();
    this.blur.emit($event);
  }

  inputFill($event: any) {
    this.keyup.emit($event);
  }

  onPaste(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    if(+this.minNumber >= 0 && (pastedText.includes('-') || pastedText.includes('+'))) {
      event.preventDefault();
      return;
    }
  }

  inputClick($event: any, value: string) {
    this.click.emit($event);
    try {
      this.onChange((this.inputType === 'text' && this.isTrim) ? this.value?.trim() : this.value);
    } catch {
      this.onChange(this.value);
    }
  }

  preventTypeSpecialSymbol(event) {
    if (+this.minNumber >= 0 && (event.key === '-' || event.key === '+')) {
      event.preventDefault();
      return;
    }
  }
  formatterCurrency = (value: number): string => {
    if (!Number.isFinite(value)) {
      return '';
    }
    return this.decimalPipe.transform(value, '1.0-2')!;
  };

  parserCurrency = (value: string): string => {
    if (!value) {
      return '';
    }
    if (this.decimalPart <= 0) {
      return value.replace(/\D+/g, '');
    } else {
      return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    }
  };


  /*registerOnValidatorChange(fn: () => void): void {
    this.onChange(fn);
  }

  validate(control: FormControl) {
    return null;
  }*/

  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  onChangeValue(value: string): void {
    this.updateValue(value);
  }

  // '.' at the end or only '-' in the input box.
  onBlur(): void {
    if (this.value.charAt(this.value.length - 1) === '.' || this.value === '-') {
      this.updateValue(this.value.slice(0, -1));
    }
  }

  updateValue(value: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.value = value;
    }
    this.inputElement!.nativeElement.value = this.value;
  }

  formatNumber(value: string): string {
    const stringValue = `${value}`;
    const list = stringValue.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
  }
}
