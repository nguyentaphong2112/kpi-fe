import { FileConstant } from '../constant/common';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

export function serialize(obj = {}) {
  const arr = [];
  for (const k of Object.keys(obj)) {
    arr.push(
      `${k}=${encodeURIComponent(
        typeof obj[k] === 'string'
          ? String.prototype.trim.call(obj[k])
          : obj[k] === null
            ? ''
            : obj[k]
      )}`
    );
  }
  return arr.join('&');
}

export function delEmptyKey(obj: {}) {
  const objCpy = {};
  if (obj === null || obj === undefined || obj === '') {
    return objCpy;
  }
  for (const key in obj) {
    if (obj[key] !== null && typeof obj[key] === 'object') {
      objCpy[key] = this.delEmptyKey(obj[key]);
    } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      objCpy[key] = obj[key];
    }
  }
  return objCpy;
}

export function isEmptyObject(obj: {}) {
  let name: any;
  // tslint:disable-next-line: forin
  for (name in obj) {
    return false;
  }
  return true;
}

export function isValidDate(date: Date) {
  return date instanceof Date && !isNaN(date.getTime());
}

export function obj2Str(obj: any) {
  const p = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] || obj[key] === 0) {
      if (obj[key].toString() !== '') {
        p[key] = obj[key].toString();
      }
    }
  }
  return p;
}

export function str2arr(str: string) {
  return str.replace(/[\r\n\s]/g, '').split(',');
}

export function getScrollbarWidth() {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.cssText =
    'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}

export function getTypeExportUlti(format: string): string {
  let type: string;
  switch (format) {
    case FileConstant.EXCEL_TYPE_1:
      type = FileConstant.EXCEL_MIME_1;
      break;
    case FileConstant.EXCEL_TYPE_2:
      type = FileConstant.EXCEL_MIME_2;
      break;
    case FileConstant.PDF_TYPE:
      type = FileConstant.PDF_MIME;
      break;
    case FileConstant.DOC_TYPE:
      type = FileConstant.DOC_MIME;
      break;
    case FileConstant.DOCX_TYPE:
      type = FileConstant.DOCX_MIME;
      break;
    default:
      type = null;
      break;
  }
  return type;
}

export function convertToType(typevar, input) {
  return {
    'string': String.bind(null, input),
    'number': Number.bind(null, input)
  }[typeof typevar]();
}

export function checkFileExtension(fileName: string, ...fileExtensions) {
  if (!!fileName) {
    return fileExtensions.some((item) => fileName.toLowerCase().endsWith(item.toLowerCase()));
  }
}

export function beforeUploadFile(file: File | NzUploadFile, fileList, fileSize: number, toastrService: ToastrService, translate: TranslateService, error: string, ...fileExtensions) {
  let check = true;
  if (fileExtensions.length > 0) {
    check = fileExtensions.some((item) => file?.name.toLowerCase().endsWith(item.toLowerCase()));
  }
  if (file.size >= fileSize || !check) {
    error ? toastrService.error(translate.instant(error)) : null;
    fileList = [];
    return fileList;
  }
  fileList = fileList.concat(file);
  return fileList;
}

export function openAddModalUtils(id: number, modal: NzModalRef, modalService: NzModalService, translateService: TranslateService, nzTitle: string, nzContent, ratioWidth?: number) {
  const ratio = ratioWidth ? ratioWidth : 1.5;
  modal = modalService.create({
    nzWidth: window.innerWidth > 767 ? window.innerWidth / ratio > 1100 ? 1100 : window.innerWidth / ratio : window.innerWidth,
    nzTitle: translateService.instant(nzTitle),
    nzContent: nzContent,
    nzComponentParams: {
      id: id
    },
    nzFooter: null
  });
  return modal;
}

