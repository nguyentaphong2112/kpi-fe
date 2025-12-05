import { Observable } from 'rxjs';
import _ from 'lodash';
import { BaseResponse } from '../models/base-response';
import { HTTP_STATUS_CODE, SYSTEM_FORMAT_DATA } from '../constant/system.constants';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StringUtils } from '../../shared/utils/string-utils.class';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { endOfMonth, format, parse, startOfMonth } from 'date-fns';

export class Utils {
  private static async preresolve(promises, value, key?: string) {
    if (key === 'callback' || key === 'socket' || key === 'listener') {
      promises.push(value);
      return;
    }
    if (value instanceof Function) {
      this.preresolve(promises, value());
    } else if (value instanceof Array) {
      const inpromises = [];
      value.forEach((v) => {
        this.preresolve(inpromises, v);
      });
      promises.push(Promise.all(inpromises));
    } else if (value instanceof Observable) {
      promises.push(value.toPromise());
    } else if (value instanceof Promise) {
      promises.push(value);
    } else if (value instanceof Object) {
      promises.push(this.resolve(value));
    } else {
      promises.push(value);
    }
  }

  static async resolve(value: Object) {
    const keys = [];
    const promises = [];
    for (const i in value) {
      if (value.hasOwnProperty(i)) {
        keys.push(i);
        this.preresolve(promises, value[i], i);
      }
    }
    const values = await Promise.all(promises);
    const raw = {};
    keys.forEach((key: string, index: number) => {
      raw[key] = values[index];
    });
    return raw;
  }

  static initForm(myInitForm: NzSafeAny): FormGroup {
    const fb: FormBuilder = new FormBuilder();
    const formOptions = myInitForm.FORM_OPTIONS;
    delete myInitForm.FORM_OPTIONS;
    const controlsConfig = {};
    for (const [key, value] of Object.entries(myInitForm)) {
      controlsConfig[myInitForm[key].name] = [myInitForm[key].initialValue, myInitForm[key].validators];
    }
    return fb.group(controlsConfig, formOptions);
  }

  static fullResetFormControl(formControls: AbstractControl[]) {
    if (formControls && formControls.length > 0) {
      for (const fc of formControls) {
        fc.reset();
        fc.setValidators(null);
        fc.setErrors(null);
        fc.updateValueAndValidity();
      }
    }
  }

  // static isEmailValid(email: string): boolean {
  //   const regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.+[A-Z]{2,4}/gim;
  //   return regex.test(email);
  // }
  static isNotNull(obj: any): boolean {
    return !this.isNull(obj);
  }

  static isNull(obj: any): boolean {
    return obj === undefined || obj === null || Object.keys(obj).length === 0;
  }

  static isEmpty(obj: any): boolean {
    return _.isEmpty(obj);
  }

  static isNotEmpty(obj: any): boolean {
    return !this.isEmpty(obj);
  }

  static isFunction(obj: any): boolean {
    return this.isNotNull(obj) && obj instanceof Function;
  }

  static isNotFunction(obj: any): boolean {
    return !this.isFunction(obj);
  }

  static isStringEmpty(obj: string): boolean {
    return this.isNull(obj) || obj === '';
  }

  static isStringNotEmpty(obj: string): boolean {
    return !this.isStringEmpty(obj);
  }

  static isArrayEmpty(obj: any[]): boolean {
    return this.isNull(obj) || obj.length === 0;
  }

  static isArrayNotEmpty(obj: any[]): boolean {
    return !Utils.isArrayEmpty(obj);
  }

  static isHtmlNotEmpty(text: string): boolean {
    return !Utils.isHtmlEmpty(text);
  }

  static subString(text: string) {
    return text?.substr(0, 1) || '';
  }

  static isHtmlEmpty(text: string): boolean {
    if (Utils.isNull(text)) {
      return true;
    }
    text = text.replace(/(<([^>]+)>)/gi, '');
    text = text.trim();
    return Utils.isStringEmpty(text);
  }

  static number(obj: any, defaultValue?: number) {
    if (Utils.isNull(obj) || Utils.isStringEmpty(obj) || isNaN(obj)) {
      return defaultValue;
    }
    return Number(obj);
  }

  static shorten(text: string, numOfCharacters: number = 300): string {
    if (Utils.isStringNotEmpty(text)) {
      text = text.replace(/(<([^>]+)>)/gi, '');
      text = text.replace(/\s+/g, ' ');
      if (text.length > numOfCharacters) {
        text = text.substr(0, numOfCharacters) + '...';
      }
    }
    return text;
  }

  static stripHtmlTags(text: string): string {
    return text ? text.replace(/\<.*?\>/gi, '') : undefined;
  }

  static parseToEnglish(text: string): string {
    if (Utils.isNull(text)) {
      return '';
    }
    let value = text.trim().toLowerCase();
    value = value.replace(/[áàảãạâấầẩẫậăắằẳẵặ]/gi, 'a');
    value = value.replace(/[éèẻẽẹêếềểễệ]/gi, 'e');
    value = value.replace(/[iíìỉĩị]/gi, 'i');
    value = value.replace(/[óòỏõọơớờởỡợôốồổỗộ]/gi, 'o');
    value = value.replace(/[úùủũụưứừửữự]/gi, 'u');
    value = value.replace(/[yýỳỷỹỵ]/gi, 'y');
    value = value.replace(/[đ]/gi, 'd');
    return value;
  }

  static trim(text: string) {
    return text.trim();
  }

  static trimToNull(value: string) {
    if (this.isNull(value)) {
      return null;
    } else {
      return value.trim();
    }
  }

  static trimNullToEmpty(value: string) {
    if (this.isNull(value)) {
      return '';
    } else {
      return value.trim();
    }
  }

  static numberWithCommas(x) {
    return x?.toString().replace(/\B(?=(\d\d\d)+(?!\d))/g, ',');
  }

  static parseCode(value: string) {
    if (Utils.isStringEmpty(value)) {
      return '';
    }
    const i = value.lastIndexOf('-');
    if (i >= 0) {
      return value.substr(i + 1);
    }
    return value;
  }

  static truncate(value: string, limit = 30, completeWords = false, ellipsis = '...') {
    if (value.length < limit) {
      return `${value.substr(0, limit)}`;
    }
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return `${value.substr(0, limit)}${ellipsis}`;
  }

  static processResponse(responseFromServer: BaseResponse<any>, toastrService: ToastrService, translateService: TranslateService) {
    switch (responseFromServer.code) {
      case HTTP_STATUS_CODE.OK:
        return responseFromServer?.data;
      case HTTP_STATUS_CODE.CREATED:
        toastrService.error(responseFromServer?.message);
        break;
      default:
        toastrService.error(translateService.instant('common.notification.errorServer'));
        break;
    }
    return null;
  }

  // Neu be tra ve Date voi dinh dang dd/MM/yyyy kieu string.
  static convertDateToFillForm(dateFromServer: any, format?: string) {
    if (StringUtils.isNullOrEmpty(dateFromServer)) {
      return null;
    }

    if (dateFromServer instanceof Date) {
      return dateFromServer;
    }
    return parse(dateFromServer.toString(), format ? format : SYSTEM_FORMAT_DATA.DATE_FORMAT, new Date());
  }

  static convertDateToSendServer(date: any, formatDate?: string) {
    if (!!date) {
      return format(date, formatDate ? formatDate : SYSTEM_FORMAT_DATA.DATE_FORMAT);
    }
    return null;
  }

  static processTrimFormControlsBeforeSend(form: FormGroup, ...formControlsName) {
    const controls = form.controls;
    for (const controlName of formControlsName) {
      const value = controls[controlName]?.value;
      controls[controlName].setValue(value?.trim());
    }
  }

  static getFirstDayOrLastDayOfCurrentMonth(firstDay: boolean) {
    const now = new Date();
    if (!firstDay) { // ngay cuoi thang
      return endOfMonth(new Date());
    }
    return startOfMonth(new Date());
  }
}
