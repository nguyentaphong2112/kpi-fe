import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { parse, startOfDay } from 'date-fns';

const regexPhoneMobileVN = new RegExp(/^(84[35789][0-9]{8}|0[35789][0-9]{8})$/g);
// const regexEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
const regexOnlyNumber = new RegExp(/^[0-9]*$/g);
const regexCode = new RegExp(/^[0-9A-Z-_]*$/g);
const regexCodeKpi = new RegExp(/^[a-zA-Z0-9]*$/g);
// ([1-9]|0(?=,[1-9])) -> Bat dau boi 1-9 hoac 0 nhung theo sau boi , va 1-9
const regexRate = new RegExp(/^([1-9]|0(?=,[1-9]))(\d*)(,\d)?$/g);
// 2 number decimal
const regexStandardKpi = new RegExp(/^(\d+)(,\d{1,2})?$/g);
const regexValueByTitle = new RegExp(/^(\d+)(,\d{1,2})?$/g);
const valueFactor = new RegExp(/^(\d+)(,\d{1,2})?$/g);
const regexRmTime = new RegExp(/^(\d+)(,\d{1,2})?$/g);
const regexSpecial = '^[A-Za-z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]*';

export class CustomValidators {
  static required(control: AbstractControl): ValidationErrors | null {
    if (
      (!control.value && control.value !== 0 && control.value !== false) ||
      control.value?.toString()?.trim()?.length === 0
    ) {
      return { cusRequired: true };
    }
    return null;
  }

  static code(control: AbstractControl): ValidationErrors | null {
    regexCode.lastIndex = 0;
    if (control.value && !regexCode.test(control.value?.toString())) {
      return { code: true };
    }
    return null;
  }

  static codeKpi(control: AbstractControl): ValidationErrors | null {
    regexCodeKpi.lastIndex = 0;
    if (control.value && !regexCodeKpi.test(control.value?.toString())) {
      return { code: true };
    }
    return null;
  }

  static valueFactor(control: AbstractControl): ValidationErrors | null {
    valueFactor.lastIndex = 0;
    const factor = parseFloat(control.value?.toString()?.replace(',', '.'));
    const validFactor = factor > 0;
    if (control.value && (!valueFactor.test(control.value?.toString()) || !validFactor)) {
      return { value: true };
    }
    return null;
  }

  static rate(control: AbstractControl): ValidationErrors | null {
    regexRate.lastIndex = 0;
    const rate = parseFloat(control.value?.toString()?.replace(',', '.'));
    const validRate = rate > 0 && rate <= 100;
    if (control.value && (!regexRate.test(control.value?.toString()) || !validRate)) {
      return { value: true };
    }
    return null;
  }

  static standardKpi(control: AbstractControl): ValidationErrors | null {
    regexStandardKpi.lastIndex = 0;
    const standardKpi = parseFloat(control.value?.toString()?.replace(',', '.'));
    const validStandardKpi = standardKpi >= 0;
    if (control.value && (!regexStandardKpi.test(control.value?.toString()) || !validStandardKpi)) {
      return { value: true };
    }
    return null;
  }

  static assignKpi(control: AbstractControl): ValidationErrors | null {
    regexStandardKpi.lastIndex = 0;
    const assignKpi = parseFloat(control.value?.toString()?.replace(',', '.'));
    const validAssignKpi = assignKpi >= 0;
    if (control.value && (!regexStandardKpi.test(control.value?.toString()) || !validAssignKpi)) {
      return { value: true };
    }
    return null;
  }

  static valueRmTime(control: AbstractControl): ValidationErrors | null {
    regexRmTime.lastIndex = 0;
    const timeRate = parseFloat(control.value?.toString()?.replace(',', '.'));
    const validTimeRate = timeRate > 0 && timeRate <= 1;
    if (control.value && (!regexRmTime.test(control.value?.toString()) || !validTimeRate)) {
      return { value: true };
    }
    return null;
  }

  static valueByTitle(control: AbstractControl): ValidationErrors | null {
    regexValueByTitle.lastIndex = 0;
    const valueByTitle = parseFloat(control.value?.toString()?.replace(',', '.'));
    const validValueByTitle = valueByTitle >= 0;
    if (control.value && (!regexValueByTitle.test(control.value?.toString()) || !validValueByTitle)) {
      return { value: true };
    }
    return null;
  }

  static noSpace(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.toString().indexOf(' ') >= 0) {
      return { noSpace: true };
    }
    return null;
  }

  static phoneMobileVN(control: AbstractControl): ValidationErrors | null {
    regexPhoneMobileVN.lastIndex = 0;
    if (control.value && !regexPhoneMobileVN.test(control.value.toString())) {
      return { phoneMobile: true };
    }
    return null;
  }

  static onlyNumber(control: AbstractControl): ValidationErrors | null {
    regexOnlyNumber.lastIndex = 0;
    if (control.value && !regexOnlyNumber.test(control.value.toString())) {
      return { onlyNumber: true };
    }
    return null;
  }

  static imageSizeValidator(maxSize: number) {
    return function(input: FormControl) {
      if (input.value) {
        return input.value.size > maxSize ? { maxSize: true } : null;
      }
      return null;
    };
  }

  static toDateAfterFromDate(fromDateField: string, toDateField: string) {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      let fromDate = formGroup.get(fromDateField).value;
      let toDate = formGroup.get(toDateField).value;
      if ((fromDate !== null && toDate !== null)) {
        fromDate = startOfDay(formGroup.get(fromDateField).value);
        toDate = startOfDay(formGroup.get(toDateField).value);
        if (fromDate > toDate) {
          formGroup.get(toDateField).setErrors({ toDateNotAfterFromDate: true });
          return { toDateNotAfterFromDate: true };
        } else {
          formGroup.get(toDateField).setErrors(null);
        }
      }
      return null;
    };
  }

  static atLeastOneRequired(controlNames: Array<string>) {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      let error = { atLeastOneRequired: true };
      controlNames.every(controlName => {
        const value = formGroup.get(controlName).value;
        if (value) {
          error = null;
          return false;
        }
        return true;
      });
      controlNames.forEach(controlName => {
        formGroup.get(controlName).setErrors(error);
      });
      return error;
    };
  }

  static imageExtensionValidator(whiteListImageExtension: Array<string>) {
    return function(input: FormControl) {
      if (input.value) {
        return whiteListImageExtension.includes(input.value.type) ? null : { extension: true };
      }
      return null;
    };
  }

  static formArrayValidator(formArrayName: string, listKeyControlName: string[], valueControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formArray = control.get(formArrayName) as FormArray;
      if (!formArray) return ;
      let keys = new Set<string>();
      let objs = {};

      // Kiểm tra tất cả các phần tử trong FormArray
      for (let i = 0; i < formArray.length; i++) {
        const currentControl = formArray.at(i) as FormGroup;
        const key = this.getKey(currentControl, listKeyControlName);
        if (keys.has(key)) {
          objs[key].push(currentControl);
        } else {
          keys.add(key)
          objs[key] = [currentControl];
        }
      }
      keys.forEach(key => {
        if(objs[key]?.length > 1) {
          // lấy ra các bản ghi có value trùng
          const lookup = objs[key].reduce((a, e) => {
            a[e.value[valueControlName]] = ++a[e.value[valueControlName]] || 0;
            return a;
          }, {});

          const objErrs = objs[key].filter(e => e.value[valueControlName] != null && lookup[e.value[valueControlName]]);
          objErrs.forEach(el => {
            el.get(valueControlName).setErrors({ duplicate: true });
          });

          const objSatisfy = objs[key].filter(e => e.value[valueControlName] == null || !lookup[e.value[valueControlName]]);
          objSatisfy.forEach(el => {
            if (el.get(valueControlName)?.errors?.duplicate) {
              delete el.get(valueControlName)?.errors?.duplicate;
            }
            if (el.get(valueControlName)?.errors && Object.keys(el.get(valueControlName)?.errors).length === 0) {
              el.get(valueControlName).setErrors(null)
            }
          });
        } else {
          if (objs[key]) {
            if (objs[key][0].get(valueControlName)?.errors?.duplicate) {
              delete objs[key][0].get(valueControlName)?.errors?.duplicate;
            }
            if (objs[key][0].get(valueControlName)?.errors && Object.keys(objs[key][0].get(valueControlName)?.errors).length === 0) {
              objs[key][0].get(valueControlName).setErrors(null)
            }
          }
        }
      });
      return null;
    };
  }

  static getKey(control: FormGroup, listKeyControlName: string[]) {
    let key = '';
    listKeyControlName?.forEach(el => {
      key += control.get(el).value + '-';
    });
    return key;
  }

  static validateOnly9Or12Digit(str: string, errorName: string = 'onlyAccept9Or12Digit'): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const str1 = formGroup.get(str).value;
      const only9or12DigitPattern = new RegExp('^(\\d{9}|\\d{12})$');

      if (str1 && !only9or12DigitPattern.test(str1)) {
        formGroup.get(str).setErrors({[errorName]: true});
      } else {
        formGroup.get(str).setErrors(null);
      }
      return null;
    };
  }
}
