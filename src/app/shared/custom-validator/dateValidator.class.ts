import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateUtils } from '../utils/date-utils.class';
import { SYSTEM_FORMAT_DATA } from '@core/constant/system.constants';
import { differenceInDays, differenceInMilliseconds, format, parse } from 'date-fns';

export class DateValidator {
  static maxDateValidator(numberYears: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const date = control.value;
      if (date && date instanceof Date) {
        date.setHours(0, 0, 0, 0);
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - numberYears);
        maxDate.setHours(0, 0, 0, 0);
        if (date.getTime() > maxDate.getTime()) {
          return { maxDate: true };
        }
      }
      return null;
    };
  }

  static minDateValidator(numberYears: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const date = control.value;
      if (date && date instanceof Date) {
        date.setHours(0, 0, 0, 0);
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - numberYears);
        minDate.setHours(0, 0, 0, 0);
        if (date.getTime() < minDate.getTime()) {
          return { minDate: true };
        }
      }
      return null;
    };
  }

  static maxCurrentDateValidator(control: FormControl): any {
    const dateNow = new Date();
    const toDate = control.value;
    if (toDate && toDate instanceof Date) {
      toDate.setHours(0, 0, 0, 0);
      dateNow.setHours(0, 0, 0, 0);
      if (toDate.getTime() > dateNow.getTime()) {
        return { maxDateNow: true };
      }
    }
    return null;
  }

  static maxYesterdayDateValidator(control: FormControl): any {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - 1);
    const toDate = control.value;
    if (toDate && toDate instanceof Date) {
      toDate.setHours(0, 0, 0, 0);
      maxDate.setHours(0, 0, 0, 0);
      if (toDate.getTime() > maxDate.getTime()) {
        return { maxYesterdayDate: true };
      }
    }
    return null;
  }

  static onlyLowerTodayDate(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const today = new Date();
      if (control.value instanceof Date) {
        if (DateUtils.compareDate(control.value, today) === 1) {
          return { noLowerTodayValidator: true };
        }
      } else {
        return { noMatchClass: true };
      }
    }
    return null;
  }

  static greaterOrEqualToday(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const today = new Date();
      if (control.value instanceof Date) {
        if (DateUtils.compareDate(control.value, today) < 0) {
          return { greaterOrEqualToday: true };
        }
      }
    }
    return null;
  }

  static lower18Old(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const today = new Date();
      if (control.value instanceof Date) {
        if (DateUtils.compareDate(control.value, today, 18) === 1) {
          return { noLower18OldValidator: true };
        }
      } else {
        return { noMatchClass: true };
      }
    }
    return null;
  }

  static minYear(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value instanceof Date && control.value.getFullYear() < 1900) {
      return { minYear: true };
    }
    return null;
  }

  static validateRangeDate(sDate: string, eDate: string, errorName: string = 'fromToDate'): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const fromDate = formGroup.get(sDate).value;
      const toDate = formGroup.get(eDate).value;
      // Ausing the fromDate and toDate are numbers. In not convert them first after null check
      if ((fromDate !== null && toDate !== null) && fromDate > toDate) {
        return { [errorName]: true };
      }
      return null;
    };
  }

  static validateYearGreaterThanCurrentYear(formControlName: string, errorName: string = 'yearGreaterThanCurrentYear'): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const currentYear = new Date().getFullYear();
      const year = formGroup.get(formControlName).value;

      if (year && (~~format(year, 'yyyy') > currentYear)) {
        return { [errorName]: true };
      }
      return null;
    };
  }

  // D2t start
  static validateTwoDate(sDate: string, eDate: string, option: string = 'greater'): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      let fromDate = formGroup.get(sDate).value;
      let toDate = formGroup.get(eDate).value;
      if (fromDate && toDate) {
        fromDate = typeof fromDate === 'string' ? parse(fromDate, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT, new Date()) : fromDate;
        toDate = typeof toDate === 'string' ? parse(toDate, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT, new Date()) : toDate;
        if (option === 'greaterAndEqual' && DateUtils.compareDate(fromDate, toDate) === 1) {
          return { rangeDateError: true };
        } else if (option === 'greater' && DateUtils.compareDate(fromDate, toDate) >= 0) {
          return { rangeDateError: true };
        }
      }
      return null;
    };
  }

  static validateTwoDateTime(sDate: string, eDate: string, option: string = 'greater'): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      let fromDate = formGroup.get(sDate).value;
      let toDate = formGroup.get(eDate).value;
      if (fromDate && toDate) {
        fromDate = typeof fromDate === 'string' ? parse(fromDate, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT, new Date()) : fromDate;
        toDate = typeof toDate === 'string' ? parse(toDate, SYSTEM_FORMAT_DATA.DATE_TIME_FORMAT, new Date()) : toDate;
        if (option === 'greaterAndEqual' && DateUtils.compareDateTime(fromDate, toDate) === 1) {
          return { rangeDateError: true };
        } else if (option === 'greater' && DateUtils.compareDateTime(fromDate, toDate) >= 0) {
          return { rangeDateError: true };
        }
      }
      return null;
    };
  }

  // D2t end
  static validateSpecificRangeDate(sDate: string, eDate: string, errorName: string = 'fromToDate'): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const fromDateVal = formGroup.get(sDate).value;
      const toDateVal = formGroup.get(eDate).value;
      const fromDate = format(fromDateVal, 'yyyy-MM-DD');
      const toDate = (format(toDateVal, 'yyyy-MM-DD'));
      // compare day
      // Ausing the fromDate and toDate are numbers. In not convert them first after null check
      if ((fromDateVal !== null && toDateVal !== null) && fromDate >= toDate) {
        return { [errorName]: true };
      }
      return null;
    };
  }

  static validateSpecificValidDatetoCreateDate(initialNum: string, eDate: string, errorName: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const fromDateVal = formGroup.get(initialNum).value;
      const toDateVal = formGroup.get(eDate).value;
      const currentDate = new Date();
      const toDate = toDateVal;
      if (toDateVal && initialNum) {
        const days = differenceInDays(toDate, currentDate);
        if (fromDateVal && days <= Number(fromDateVal)) {
          return { [errorName]: true };
        }
        return null;
      }
      return null;
    };
  }

  static validateRangeMaxDate(sDate: string, eDate: string, typeRange: 'DAY' | 'MONTH' | 'YEAR', numberValue: number, errorName: string = 'maxRangDateError'): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const fromDate: Date = formGroup.get(sDate).value;
      const toDate: Date = formGroup.get(eDate).value;
      if ((fromDate !== null && toDate !== null)) {
        if (typeRange === 'DAY') {
          const differenceInTime = toDate.getTime() - fromDate.getTime();
          const differenceInDays = differenceInTime / (1000 * 3600 * 24);
          if (differenceInDays > numberValue) {
            return { [errorName]: true };
          }
        }
        if (typeRange === 'MONTH') {
          const enDate = new Date(toDate);
          enDate.setMonth(enDate.getMonth() - numberValue);
          enDate.setDate(enDate.getDate() - 1);
          enDate.setHours(0);
          enDate.setMinutes(0);
          enDate.setSeconds(59);
          enDate.setMilliseconds(0);
          const fromDateTmp = new Date(fromDate);
          fromDateTmp.setHours(0);
          fromDateTmp.setMinutes(0);
          fromDateTmp.setSeconds(59);
          fromDateTmp.setMilliseconds(0);
          if (fromDateTmp <= enDate) {
            return { [errorName]: true };
          }
        }
        if (typeRange === 'YEAR') {
          const diff = Math.floor(toDate.getTime() - fromDate.getTime());
          const day = 1000 * 60 * 60 * 24;
          const days = Math.floor(diff / day);
          const months = Math.floor(days / 31);
          const years = Math.floor(months / 12);
          if (years > numberValue) {
            return { [errorName]: true };
          }
        }
        return null;
      }
      return null;
    };
  }
}
