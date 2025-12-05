import { HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IdService } from './uuid.service';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import _ from 'lodash';
import { Utils } from '@core/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class CommonUtils {
  public static isNullOrEmpty(str: any): boolean {
    return !str || (str + '').trim() === '';
  }

  public static isValidId(id: any): boolean {
    if (CommonUtils.isNullOrEmpty(id)) {
      return false;
    }
    if (id === '0') {
      return false;
    }
    return true;
  }

  public static setFormSearchToLocalStorageByName (name: any, value : any) {
    localStorage.setItem(name, JSON.stringify(value));
  }

  public static isRealNumber(num: any): boolean {
    if (CommonUtils.isNullOrEmpty(num)) {
      return false;
    }
    if (num === '0' || num === 0) {
      return false;
    }
    return true;
  }

  public static tctReplaceAll(text: string, code: string, decode: string) {
    let old_text = text;
    do {
      old_text = text;
      text = text.replace(code, decode);
    } while (old_text !== text);
    return text;
  }

  public static trim(text: string) {
    if (text == null) {
      return text;
    }
    return text.trim();
  }

  /**
   * return 1 if num1 > num2
   * return 0 if num2 === num2
   * return -1 if num1 < num2
   */
  public static compareNumber(num1: any, num2: any): number {
    return parseFloat(num1) > parseFloat(num2) ? 1 : (parseFloat(num1) === parseFloat(num2) ? 0 : -1);
  }

  /**
   * copyProperties
   * param dest
   * param orgs
   */
  public static copyProperties(dest: any, orig: any): any {
    if (!orig) {
      return dest;
    }
    for (const k in dest) {
      if (orig.hasOwnProperty(k)) {
        dest[k] = orig[k];
      }
    }
    return dest;
  }

  /**
   * Clone all properties from source and save typeof dest
   * Author:huynq
   * @param source :object Source
   */
  public static cloneObject(dest: any, source: any): any {
    if (!source) {
      return dest;
    }
    for (const attribute in source) {
      if (source[attribute] !== undefined) {
        if (source[attribute] === null) {
          dest[attribute] = null;
        } else if (typeof source[attribute] === 'object') {
          dest[attribute] = Object.assign({}, source[attribute]);
        } else {
          dest[attribute] = source[attribute];
        }
      }
    }
    return dest;
  }

  /**
   * copyProperties
   * param dest
   * param orgs
   */
  public static buildParams(obj: any): HttpParams {
    return Object.entries(obj || {})
      .reduce((params, [key, value]) => {
        if (value === null) {
          return params.set(key, String(''));
        } else if (typeof value === typeof {}) {
          return params.set(key, JSON.stringify(value));
        } else {
          return params.set(key, String(value));
        }
      }, new HttpParams({ encoder: new CustomEncoder() }));
  }

  /**
   * validateForm
   * @param form: FormGroup
   */
  public static isValidForm(form: any): boolean {
    setTimeout(() => {
      this.markAsTouched(form);
    }, 200);
    if (form.invalid) {
      setTimeout(() => {
        CommonUtils.scrollToSmoothly('.errorMessageDiv.show');
      }, 200);
    }
    return !form.invalid;
  }

  public static isValidFormAndValidity(form: any): boolean {
    this.markAsTouchedAndValidity(form);
    return !form.invalid;
  }

  public static markAsTouched(form: any) {
    if (form instanceof FormGroup) {
      CommonUtils.isValidFormGroup(form);
    } else if (form instanceof FormArray) {
      CommonUtils.isValidFormArray(form);
    } else if (form instanceof FormControl) {
      form.markAsTouched({ onlySelf: true });
      if (form.invalid) {
        console.warn('Validate error field:', form);
      }
    }
  }

  public static offset(el): any {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  public static scrollToSmoothly(querySelectorAll, time?) {
    const elements = document.querySelectorAll(querySelectorAll);
    if (!elements) {
      return;
    }
    const first = elements[0];
    if (!first) {
      return;
    }
    const position = CommonUtils.offset(first);
    if (isNaN(position.top)) {
      console.warn('Position must be a number');
      return;
    }
    if (position.top < 0) {
      console.warn('Position can not be negative');
      return;
    }
    let top = position.top - 100;
    const currentPos = window.scrollY || window.screenTop;
    if (currentPos > position.top) {
      top = position.top + 100;
    }
    try {
      window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, top);
    }
  }

  /**
   * markAsTouchedAndValidity
   */
  public static markAsTouchedAndValidity(form: any) {
    if (form instanceof FormGroup) {
      CommonUtils.isValidFormGroupAndValidity(form);
    } else if (form instanceof FormArray) {
      CommonUtils.isValidFormArrayAndValidity(form);
    } else if (form instanceof FormControl) {
      form.updateValueAndValidity(); // tạm bổ sung ngày 28/03/2019, trường hợp validate nhập 1 thì bắt buộc nhập các trường còn lại
      form.markAsTouched({ onlySelf: true });
      if (form.invalid) {
        console.warn('Validate error field:', form);
      }
    }
  }

  public static isValidFormArrayAndValidity(form: FormArray) {
    if (form['isHidden'] === true) {// neu form đang bị ẩn thì không cần validate
      return;
    }
    for (const i in form.controls) {
      CommonUtils.markAsTouchedAndValidity(form.controls[i]); // neu form đang bị ẩn thì không cần validate
    }
  }

  public static isValidFormArray(form: FormArray) {
    if (form['isHidden'] === true) {// neu form đang bị ẩn thì không cần validate
      return;
    }
    for (const i in form.controls) {
      CommonUtils.markAsTouched(form.controls[i]); // neu form đang bị ẩn thì không cần validate
    }
  }

  public static isValidFormGroup(form: FormGroup) {
    if (form['isHidden'] === true) {
      return;
    }
    Object.keys(form.controls).forEach(key => {
      CommonUtils.markAsTouched(form.get(key));
    });
  }

  public static isValidFormGroupAndValidity(form: FormGroup) {
    if (form['isHidden'] === true) {
      return;
    }
    Object.keys(form.controls).forEach(key => {
      CommonUtils.markAsTouchedAndValidity(form.get(key));
    });
  }

  /**
   * hàm xử lý lấy nationId hiện tại theo quốc gia
   */
  public static toTreeNode(res: any): any {
    for (const node of res) {
      if (!node.leaf) {
        delete node.icon;
        if (node.children && node.children.length > 0) {
          node.children = CommonUtils.toTreeNode(node.children);
        }
      }
    }
    return res;
  }

  /**
   * nvl
   * param value
   * param defaultValue
   */
  public static nvl(value: any, defaultValue: number = 0): number {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    return value;
  }

  /**
   * convert To FormData mutilpart request post
   */
  public static convertFormData(dataPost: any): FormData {
    const filteredData = CommonUtils.convertDataSendToServer(dataPost);
    const formData = CommonUtils.objectToFormData(filteredData, '', []);
    return formData;
  }


  public static convertToFormDataFile(data: any): FormData {
    const formData = new FormData();
    if (data && typeof data === 'object') {
      for (const key in data) {
        if (data[key] instanceof File) {
          formData.append(key, data[key] as NzSafeAny);
        } else if (Array.isArray(data[key])) {
          for (let i = 0; i < data[key].length; i++) {
            if (data[key][i] instanceof File) {
              formData.append(key, data[key][i] as NzSafeAny);
            }
          }
        } else if (typeof data[key] === 'object') {
          formData.append(key, new Blob([JSON.stringify(data[key])], { type: 'application/json' }));
        }
      }
    }
    return formData;
  }

  /**
   * objectToFormData
   */
  public static objectToFormData(obj, rootName, ignoreList): FormData {
    const formData = new FormData();

    function appendFormData(data, root) {
      if (!ignore(root)) {
        root = root || '';
        if (data instanceof File) {
          formData.append(root, data);
        } else if (Array.isArray(data)) {
          let index = 0;
          for (let i = 0; i < data.length; i++) {
            if (data[i] instanceof File) {
              appendFormData(data[i], root + '[' + index + ']');
              index++;
            } else {
              appendFormData(data[i], root + '[' + i + ']');
            }
          }
        } else if (data && typeof data === 'object') {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              if (root === '') {
                appendFormData(data[key], key);
              } else {
                appendFormData(data[key], root + '.' + key);
              }
            }
          }
        } else {
          if (data !== null && typeof data !== 'undefined') {
            formData.append(root, data);
          }
        }
      }
    }

    function ignore(root) {
      return Array.isArray(ignoreList) && ignoreList.some(function(x) {
        return x === root;
      });
    }

    appendFormData(obj, rootName);
    return formData;
  }

  public static convertDataSendToServer(data: any, isSearch?: boolean): any {
    const cloneData = _.cloneDeep(data);
    if (Array.isArray(data)) {
      if (isSearch) {
        return data.join(',');
      }
      return CommonUtils.convertDataArray(cloneData, true);
    } else if (typeof cloneData === typeof {}) {
      return CommonUtils.convertDataObject(cloneData, true, isSearch);
    }
    return cloneData;
  }

  /**
   * convertDataObject
   * param data
   */
  public static convertDataObject(data: Object, isConvertDateToString?: boolean, isSearch?: boolean): Object {
    if (data) {
      for (const key in data) {
        if (data[key] instanceof Date && isConvertDateToString) {
          data[key] = Utils.convertDateToSendServer(data[key]);
        } else {
          if (CommonUtils.isValidDateFormat(data[key]) && !isConvertDateToString) {
            data[key] = Utils.convertDateToFillForm(data[key]);
          }
        }

        if (typeof data[key] === 'boolean') {
          data[key] = CommonUtils.convertBoolean(data[key]);
        } else if (typeof data[key] === typeof [] && data[key]?.length > 0) {
          data[key] = CommonUtils.convertDataArray(data[key], isConvertDateToString);
        } else if (!(data[key] instanceof File)) {
          data[key] = isConvertDateToString ? CommonUtils.convertDataSendToServer(data[key], isSearch) : CommonUtils.convertDataFindForm(data[key]);
        }
      }
    }
    return data;
  }

  public static convertDataArray(data: Array<any>, isConvertDateToString?: boolean): Array<any> {
    if (data && data.length > 0 && !(data[0] instanceof File)) {
      for (const i in data) {
        if (data[i] instanceof Date) {
          data[i] = Utils.convertDateToSendServer(data[i]);
        } else {
          data[i] = isConvertDateToString ? CommonUtils.convertDataSendToServer(data[i]) : CommonUtils.convertDataFindForm(data[i]);
        }
      }
    }
    return data;
  }

  public static convertBoolean(value: Boolean): String {
    return value ? 'Y' : 'N';
  }

  public static isValidDateFormat(dateString) {
    let isValid = false;
    // Split the date string into day, month, and year components
    if (dateString && CommonUtils.isString(dateString) && dateString.split('/').length === 3) {
      const [day, month, year] = dateString.split('/');
      // Create a new Date object (months are zero-based in JavaScript)
      const parsedDate = new Date(year, month - 1, day);
      // Check if the parsed date is a valid date and the string matches the expected format
      isValid =
        !isNaN(parsedDate.getTime()) && // Check if the parsedDate is a valid Date
        /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString); // Check if the string matches "dd/MM/yyyy" format
    }
    return isValid;
  }

  public static isString(variable) {
    return typeof variable === 'string';
  }

  public static parseDateFromString(dateString) {
    // Split the date string into day, month, and year components
    const [day, month, year] = dateString.split('/');
    // Create a new Date object (months are zero-based in JavaScript)
    const parsedDate = new Date(year, month - 1, day);
    return parsedDate;
  }

  /**
   * convertData
   */
  public static convertDataFindForm(data: any): any {
    if (typeof data === typeof {}) {
      return CommonUtils.convertDataObject(data);
    } else if (typeof data === typeof []) {
      return CommonUtils.convertDataArray(data);
    } else {
      return data;
    }
  }

  /**
   * tctGetFileSize
   * param files
   */
  public static tctGetFileSize(files) {
    try {
      let fileSize;
      // if (typeof files === typeof []) {
      //   fileSize = files[0].size;
      // } else {
      fileSize = files.size;
      // }
      fileSize /= (1024 * 1024); // chuyen ve MB
      return fileSize;
    } catch (ex) {
      console.error(ex.message);
    }
  }

  /**
   * createForm controls
   */
  public static createForm(formData: any, options: any, validate?: any): FormGroup {
    const formGroup = new FormGroup({});
    for (const property in options) {
      if (formData.hasOwnProperty(property)) {
        options[property][0] = formData[property];
      }
      formGroup.addControl(property, new FormControl(options[property][0], options[property][1]));
    }
    if (validate) {
      formGroup.setValidators(validate);
    }
    return formGroup;
  }

  /**
   * pureDataToTreeNode: for workFlows - Menu
   * @param dataSource: array Menu in VPS
   * @param pureData: array Workflows in VHCM_System
   */
  public static pureDataToTreeNode(dataSource: any, pureData: any): any {
    const dataDest = [];
    for (const item of pureData) {
      const tmp = dataSource.find(x => x.nodeId === item.nodeId);
      if (tmp) {
        tmp.isMainAction = item.isMainAction ? item.isMainAction : null;
        tmp.workFlowId = item.workFlowId ? item.workFlowId : null;
        tmp.wfMenuMappingId = item.wfMenuMappingId ? item.wfMenuMappingId : null;
        tmp.referenceNum = dataSource.filter(x => x.parentId === tmp.nodeId).length;
        dataDest.push(tmp);
      }
    }
    return CommonUtils.sort(dataDest, 'sortOrder');
  }

  /**
   * sort
   * @param dataSource: array
   * @param fieldSort: field choosed to sort
   * @param ascending: ascending: 1; descending: -1; default: 1.
   */
  public static sort(dataSource: any, fieldSort: any, ascending?: number) {
    if (!ascending) {
      ascending = 1;
    }
    return dataSource.sort((left, right): number => {
      if (left[fieldSort] < right[fieldSort]) {
        return -ascending;
      }
      if (left.sortOrder > right.sortOrder) {
        return ascending;
      }
      return 0;
    });
  }

  public static convertVpsMenus(data: any, keyId?: string): any {
    keyId = keyId || 'nodeId';
    const dataMap = data.reduce((m, d) => {
      m[d[keyId]] = Object.assign({}, d);
      return m;
    }, {});
    const listTemp = data.filter(d => {
      if (d.parentId !== null) { // assign child to its parent
        const parentNode = dataMap[d.parentId];
        if (!parentNode) {
          return true;
        }
        if (parentNode['items'] === undefined || parentNode['items'] === null) {
          parentNode['items'] = [];
        }
        parentNode.items.push(dataMap[d[keyId]]);
        return false;
      }
      return true; // root node, do nothing
    }).map(d => dataMap[d[keyId]]);
    return listTemp;
  }

  // Check giao quá trình giữa 2 khoảng ngày
  public static tctCompareDates(date1, date2): number {
    const diff = date1 - date2;
    return (diff < 0) ? -1 : (diff === 0) ? 0 : 1;
  }

  public static betweenDate(check, startDate, endDate): boolean {
    return (CommonUtils.tctCompareDates(startDate, check) <= 0) && (CommonUtils.tctCompareDates(check, endDate) <= 0);
  }

  /**
   * check date conflict time
   * @param Date startDate1
   * @param Date endDate1
   * @param Date startDate2
   * @param Date endDate2
   * @return true or false
   */
  public static isConflictDate(startDate1, endDate1, startDate2, endDate2) {
    if (CommonUtils.isNullOrEmpty(endDate2)) {
      return (CommonUtils.isNullOrEmpty(endDate1) || (CommonUtils.tctCompareDates(startDate2, endDate1) <= 0));
    } else {
      return (CommonUtils.isNullOrEmpty(endDate1) && (CommonUtils.tctCompareDates(startDate1, endDate2) < 0))
        || (!CommonUtils.isNullOrEmpty(endDate1)
          && (CommonUtils.betweenDate(startDate1, startDate2, endDate2)
            || CommonUtils.betweenDate(endDate1, startDate2, endDate2)
            || CommonUtils.betweenDate(startDate2, startDate1, endDate1)
            || CommonUtils.betweenDate(endDate2, startDate1, endDate1))
        );
    }
  }

  private static toUrlString(src: any) {
    let dest = src;
    while (dest.indexOf(':') >= 0) {
      dest = dest.replace(':', '%3A');
    }
    while (dest.indexOf('/') >= 0) {
      dest = dest.replace('/', '%2F');
    }
    return dest;
  }

  public static joinStringFromArray(listObject: any, fieldName: any, separator?: any) {
    if (!separator) {
      separator = ',';
    }
    const arrTemp = [];
    listObject.forEach((o) => {
      arrTemp.push(o[fieldName]);
    });
    return arrTemp.join(separator);
  }

  public static getListYear(fromYear?: number, toYear?: number) {
    const listYear = [];
    if (fromYear && toYear) {
      for (let i = fromYear; i <= toYear; i++) {
        const obj = {
          year: i
        };
        listYear.push(obj);
      }
    }
    return listYear;
  }

  // D2T start
  public static isSuccessRequest(res) {
    return res?.code == HTTP_STATUS_CODE.OK;
  }

  public static isBadRequest(res) {
    return res?.code == HTTP_STATUS_CODE.BAD_REQUEST;
  }

  // D2T end
  public static setFormValue(form: FormGroup, value) {
    for (let controlName in form.controls) {
      if (value[controlName]) {
        form.controls[controlName].setValue(value[controlName]);
      }
    }
  }
}

class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ValidateService {
  constructor(
    private idService: IdService
  ) {
  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getRowIndex(index, pageIndex, pageSize, listIndexTdCustom?: number[]) {
    let idx: number = index + 1 + pageSize * (pageIndex - 1);
    if (listIndexTdCustom?.length > 0) {
      const countIdxCus = listIndexTdCustom.filter(value => value < idx).length;
      idx -= countIdxCus;
    }
    return idx;
  }

  guidGenerator() {
    return this.idService.generate();
  }

  _keyPressPercent(event: any) {
    const pattern = /^[0-9]*\.?[0-9]*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
