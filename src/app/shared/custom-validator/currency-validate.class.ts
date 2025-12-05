import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

export class CurrencyValidator {
  static required(control: FormControl): any {
    const value = control.value;
    if (!value || value == 0) {
      return { required: true };
    }
    return null;
  }

  static validateMinMaxCurency(min: string, max: string, errorName: string = 'notMatch'): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const minCurency = formGroup.get(min).value;
      const maxCurency = formGroup.get(max).value;
      if (((minCurency !== null && minCurency !== '') &&
          (maxCurency !== null && maxCurency !== '')) &&
        Number(minCurency) > Number(maxCurency)) {
        return { [errorName]: true };
      }
      return null;
    };
  }
}
