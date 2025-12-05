import { FormControl, FormGroup } from '@angular/forms';
import { Scopes } from './common-constants';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash';
import { Utils } from '@core/utils/utils';

export function validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach((field) => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      validateAllFormFields(control);
    }
  });
}

export function cleanDataForm(formGroup: FormGroup) {
  const form = formGroup;
  Object.keys(form.controls).forEach((field) => {
    const control = form.get(field);
    if (control instanceof FormControl && typeof control.value === 'string') {
      control.setValue(Utils.trimNullToEmpty(control.value), { emitEvent: false });
    } else if (control instanceof FormGroup) {
      cleanDataForm(control);
    }
  });
  return form.getRawValue();
}

export function cleanData(data: any) {
  Object.keys(data).forEach((key) => {
    if (_.isString(data[key]) || _.isNull(data[key]) || _.isUndefined(data[key])) {
      data[key] = _.trim(data[key]);
    } else if (_.isArray(data[key])) {
      const array = data[key];
      for (let index = 0; index < array?.length; index++) {
        array[index] = _.trim(array[index]);
      }
    } else if (_.isObject(data[key])) {
      cleanData(data[key]);
    }
  });
}

export function checkScopeForScreen(scope, objFunction) {
  if (!objFunction) {
    return false;
  }
  switch (scope) {
    case Scopes.CREATE:
      return objFunction.create;
    case Scopes.EDIT:
      return objFunction.update;
    case Scopes.VIEW:
      return objFunction.view;
    case Scopes.DELETE:
      return objFunction.delete;
    case Scopes.DOWNLOAD:
      return objFunction.download;
    case Scopes.IMPORT:
      return objFunction.import;
    default:
      return false;
  }
}

export function percentage(value: number, total: number) {
  if (value === 0 && total === 0) {
    return value.toFixed(2);
  }
  return ((100 * value) / total)?.toFixed(2);
}

export function checkRespondSuccess(respond) {
  return !(respond instanceof HttpErrorResponse);
}

export function getTextWidth(text: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  // context.font = getComputedStyle(document.body).font;
  return context.measureText(text).width;
}

export function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
