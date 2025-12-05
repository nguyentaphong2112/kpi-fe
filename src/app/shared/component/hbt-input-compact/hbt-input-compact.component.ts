import { Component, EventEmitter, forwardRef, Injector, Input, OnChanges, OnInit, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { noop } from 'rxjs';
import { SelectModal } from '../hbt-select/select.component';
import { _variable } from '@core/global-style/_variable';

export class ModelInput {
  groupType?: 'noIcon' | 'icon' | 'textarea' = 'noIcon';
  type?: 'default' | 'warning' | 'error' | 'success' = 'default';
  labelText?: string;
  textMessageValue?: string;
  showIcon?: boolean = true;
  placeholder?: string = '';
  suffixIcon?: 'search' | 'down' | string = null;
  prefixIcon?: 'search' | 'down' | string = null;
  autoSize?: { [key: string]: number } = { minRows: 4, maxRows: 4 };
  rows?: number;
  disable?: boolean;
  autofocus?: 'autofocus' | null;
  showFlexEnd?: boolean = true;
  isDatepicker?: boolean = false;
  dateConfig?: any;
  showError?: boolean = false;
}

@Component({
  selector: 'hbt-input-compact',
  templateUrl: './hbt-input-compact.component.html',
  styleUrls: ['../../../core/global-style/_input.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HbtInputCompactComponent),
    }
  ]
})
export class HbtInputCompactComponent implements OnInit, ControlValueAccessor, OnChanges { // , Validator {
  @Input() config: ModelInput = new ModelInput();
  @Input() labelText: string;
  @Input() placeholderText = '';
  @Input() disable = false;
  @Input() autofocus = false;
  @Input() type: 'default' | 'warning' | 'error' | 'success';
  @Input() showFlexEnd = true;
  @Input() isDatepicker = false;
  @Input() datepickerConfig: any;
  @Input() errorDefs: { errorName: string, errorDescription: string }[];
  @Input() showIconMessage = true;
  @Input() showError = false;
  @Input() errors: any;
  @Input() dataSelects: any[] = [];
  @Input() keyLabel: string = 'label';
  @Input() keyValue: string = 'value';
  @Input() optionHeightPx = 56;
  @Input() optionOverflowSize = 5;
  @Input() showRadio = false;
  @Input() doOpenFormArray = true;
  @Input() groupName = 'phoneNumbers';
  @Input() selectControlName = 'regionCode';
  @Input() inputControlName = 'phoneNumber';
  @Input() inputMainControlName = 'phoneNumberMain';
  @Input() validInput: ValidatorFn[] = [Validators.required];
  @Input() selectDefaultValue = '+84';
  @Output() eventEmit: EventEmitter<SelectModal> = new EventEmitter<SelectModal>();
  listOfSelectedValue: any;
  radioValue: any;
  formInput: FormGroup;
  validateObjs = [];
  inputGroupGroupClasses = [];
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
    success: 'input__group--group--success',
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
  value: any[];
  bsDatepicker = 'bsDatepicker';

  _variable = _variable;
  constructor(
    private inj: Injector,
    private fb: FormBuilder
  ) {
    this.inputGroupClass = 'input__group' + ' ';
    this.inputGroupGroupClass = 'input__group--group' + ' ';
    this.inputTextClass = 'input__text' + ' ';
    this.inputMessageClass = 'input__message ' + ' ';
  }

  ngOnInit() {
    let validateObj: { [key: string]: any } = {};
    validateObj.textMessageValue = 'Số điện thoại không được để trống';
    validateObj.showTextMessageValue = false;
    validateObj.showIconMessage = true;
    this.validateObjs = [validateObj];
    this.inputGroupGroupClasses = ['input__group--group `input__group--group--default`'];
    this.ngControl = this.inj.get(NgControl);
    let formControl = new FormGroup({});
    formControl.addControl(this.groupName, this.fb.array([this.createPhoneNumbersFormGroup(null, null)]));
    this.formInput = this.fb.group(formControl.controls);
    this.formInput.valueChanges.subscribe(() => {
      let value = null;
      let isValid = true;
      for (let i = 0; i < (this.formInput.get(this.groupName) as FormArray).controls.length; i++) {
        if (!(this.formInput.get(this.groupName) as FormArray).controls[i].valid) {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        this.configValue();
        value = this.formInput.value[this.groupName];
      }
      this.onChange(value);
    });
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

  createPhoneNumbersFormGroup(item: any, index: number): FormGroup {
    let formControl = new FormGroup({});
    formControl.addControl(this.selectControlName, new FormControl(item ? item[this.selectControlName] : this.selectDefaultValue, Validators.required));
    formControl.addControl(this.inputControlName, new FormControl(item ? item[this.inputControlName] : null, this.validInput));
    formControl.addControl(this.inputMainControlName, new FormControl(item ? item[this.inputMainControlName] : null));
    formControl.addControl('index', new FormControl(index ? index : null));
    return new FormGroup(formControl.controls);
  }

  addPhoneNumbersFormGroup() {
    let isValid = true;
    let maxI = 0;
    const idx = this.formInput.value[this.groupName][0]?.index;
    this.radioValue = idx;
    for (let i = 0; i < (this.formInput.get(this.groupName) as FormArray).controls.length; i++) {
      maxI += 1;
      let arrayErrors = ((this.formInput?.get(this.groupName) as FormArray)?.controls[i]['controls'][this.inputControlName] as FormControl).errors;
      if (!(this.formInput.get(this.groupName) as FormArray).controls[i].valid) {
        for (let error of this.errorDefs) {
          let key = error.errorName;
          if (arrayErrors != null && arrayErrors[key]) {
            this.validateObjs[i].textMessageValue = error.errorDescription;
          }
        }
        isValid = false;
        this.validateObjs[i].showTextMessageValue = true;
        this.inputGroupGroupClasses[i] = 'input__group--group input__group--group--error';
      } else {
        this.validateObjs[i].showTextMessageValue = false;
        this.inputGroupGroupClasses[i] = 'input__group--group input__group--group--default';
      }
    }
    if (isValid) {
      let validateObj: { [key: string]: any } = {};
      validateObj.textMessageValue = 'Số điện thoại không được để trống';
      validateObj.showTextMessageValue = false;
      validateObj.showIconMessage = true;
      if (this.showError) {
        this.inputGroupGroupClasses[maxI] = 'input__group--group input__group--group--error';
      } else {
        this.inputGroupGroupClasses[maxI] = 'input__group--group input__group--group--default';
      }
      this.validateObjs = [...this.validateObjs, validateObj];
      const phoneNumber = this.formInput.get(this.groupName) as FormArray;
      phoneNumber.push(this.createPhoneNumbersFormGroup(null, idx));
    }
  }

  removeOrClearPhoneNumbers(i: number) {
    const phoneNumber = this.formInput.get(this.groupName) as FormArray;
    const idx = this.formInput.value[this.groupName][0]?.index;
    this.radioValue = idx;
    (this.formInput.value[this.groupName] as Array<any>).forEach((item, j) => {
      if (i < item.index) {
        item.index = idx - 1;
      }
    });
    if (phoneNumber.length > 1) {
      this.validateObjs.splice(i, 1);
      this.inputGroupGroupClasses.splice(i, 1);
      phoneNumber.removeAt(i);
    } else {
      let validateObj: { [key: string]: any } = {};
      validateObj.textMessageValue = 'Số điện thoại không được để trống';
      validateObj.showTextMessageValue = false;
      validateObj.showIconMessage = true;
      this.validateObjs = [validateObj];
      this.inputGroupGroupClasses[i] = 'input__group--group input__group--group--default';
      phoneNumber.reset();
    }
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
    if (this.disable) {
      this.config.disable = this.disable;
    }
    this.config.groupType = 'icon';
    if (this.autofocus) {
      this.config.autofocus = 'autofocus';
    }
    if (!this.showFlexEnd) {
      this.config.showFlexEnd = this.showFlexEnd;
    }
    if (this.isDatepicker) {
      this.config.isDatepicker = this.isDatepicker;
    }
    this.config.showError = this.showError;
    this.config.showIcon = this.showIconMessage;
    if (this.datepickerConfig) {
      this.config.dateConfig = this.datepickerConfig;
    } else {
      this.config.dateConfig = {
        dateInputFormat: 'dd/MM/yyyy', returnFocusToInput: true
      };
    }
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
      for (let i = 0; i < (this.formInput?.get(this.groupName) as FormArray)?.controls.length; i++) {
        let arrayErrors = ((this.formInput?.get(this.groupName) as FormArray)?.controls[i]['controls'][this.inputControlName] as FormControl).errors;
        if (!(this.formInput?.get(this.groupName) as FormArray)?.controls[i].valid) {
          for (let error of this.errorDefs) {
            let key = error.errorName;
            if (arrayErrors != null && arrayErrors[key]) {
              this.validateObjs[i].showTextMessageValue = this.showError;
              this.validateObjs[i].textMessageValue = error.errorDescription;
              this.inputGroupGroupClasses[i] = this.showError ? 'input__group--group input__group--group--error' : 'input__group--group input__group--group--default';
            }
          }
        } else {
          this.validateObjs[i].showTextMessageValue = false;
          this.inputGroupGroupClasses[i] = 'input__group--group input__group--group--default';
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
    this.config.disable = isDisabled;
  }

  writeValue(obj: any[]): void {
    this.value = obj;
    if (this.value != null && this.value.length > 0) {
      const form = this.formInput.get(this.groupName) as FormArray;
      form.clear();
      let idx;
      this.value.forEach((item, index) => {
        let validateObj: { [key: string]: any } = {};
        validateObj.textMessageValue = 'Số điện thoại không được để trống';
        validateObj.showTextMessageValue = false;
        validateObj.showIconMessage = true;
        this.validateObjs = [...this.validateObjs, validateObj];
        if (item[this.inputMainControlName] === 1) {
          idx = index;
          this.radioValue = idx;
        }
        form.push(this.createPhoneNumbersFormGroup(item, idx));
      });
    }
  }

  /*registerOnValidatorChange(fn: () => void): void {
    this.onChange(fn);
  }

  validate(control: FormControl) {
    return null;
  }*/
  configValue() {
    (this.formInput.value[this.groupName] as Array<any>).forEach((item, j) => {
      if (j === item.index) {
        item[this.inputMainControlName] = 1;
      } else {
        item[this.inputMainControlName] = 0;
      }
    });
  }

  getShowError(i): boolean {
    if ((this.formInput.get(this.groupName) as FormArray).controls[i].valid) {
      this.validateObjs[i].showTextMessageValue = false;
    }
    return this.validateObjs[i].showTextMessageValue;
  }

  getShowIcon(i): boolean {
    return this.validateObjs[i].showIconMessage;
  }

  getMessageValue(i): string {
    return this.validateObjs[i].textMessageValue;
  }

  getInputGroupGroupClass(i): string {
    if ((this.formInput.get(this.groupName) as FormArray).controls[i].valid) {
      this.inputGroupGroupClasses[i] = 'input__group--group input__group--group--default';
    }
    return this.inputGroupGroupClasses[i];
  }
}
