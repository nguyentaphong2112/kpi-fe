import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if ((control.value as string).indexOf(' ') >= 0) {
        return { cannotContainSpace: true };
      }
      return null;
    }
    return null;
  }

  static noWhitespaceValidator(inputText: string, noAllowSpace: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const fromDateVal = formGroup.get(inputText).value;
      if (fromDateVal?.trim() === '') {
        return { [noAllowSpace]: true };
      }
      return null;
    };
  }
}

