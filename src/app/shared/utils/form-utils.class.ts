import { FormGroup, FormArray } from '@angular/forms';
import { ElementRef } from '@angular/core';

export class FormUtils {
  static isEmpty(form: FormGroup) {
    const formValue = form.getRawValue();
    const formProperties = Object.keys(formValue);
    return formProperties.every(property =>
      formValue[property] === null || formValue[property] === '' || formValue[property] === undefined);
  }

  static disableControl(form: FormGroup, fields: any[]) {
    fields.forEach(formControlName => {
      form.controls[formControlName]?.value != null && !form.controls[formControlName]?.errors ?
        form.controls[formControlName].disable() : form.controls[formControlName].enable();
    });
  }

  static focusInvalidControl(form: FormGroup, el: ElementRef) {
    for (const key of Object.keys(form.controls)) {
      if (form.controls[key].invalid) {
        const invalidControl = el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
      }
    }
  }

  static findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): string[] {
    var invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) {
          invalidControls.push(field);
        }
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    };
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }
}

