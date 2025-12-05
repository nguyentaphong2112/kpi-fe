import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ImportError } from '@shared/model/import-error';
import { Constant } from '@shared/constant/common';
import { Observable, Subscription } from 'rxjs';
import { BaseResponse } from '@core/models/base-response';
import { UrlConstant } from '@app/shared/constant/url.class';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'hbt-import-file',
  templateUrl: './hbt-import-file.component.html',
  styleUrls: ['./hbt-import-file.component.scss']
})
export class HbtImportFileComponent {
  @Input() showContent = false;
  @Input() isPopup = true;
  @Input() closeModalWhenClick = true;
  @Input() importApi!: (body: any) => Observable<BaseResponse<any>>;
  @Input() downLoadTemplateApi!: (url?: any) => Observable<any>;
  @Input() doDownloadFileByNameApi!: (url?: any, fileName?: string) => Observable<any>;
  @Input() fileTemplateName?: string;
  @Input() isGetData = false;
  @Output() getData: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() formImport: FormGroup;
  @Input() inputParam: any;
  @Output() isSubmittedImport: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() title = this.translate.instant('common.upload.downloadData');
  isModalError: boolean = false;
  isImport: boolean = false;
  isDownloadTemplate: boolean = false;
  errorList: ImportError[] = [];
  fileList: NzUploadFile[] = [];
  fileName: string;
  fileImportName: string = '';
  fileImportSize: string;
  isExistFileImport: boolean = false;
  @Input() nzWidth: number;
  isHiddenDownloadErrorFile = false;
  subs: Subscription[] = [];

  constructor(private readonly toastrService: ToastrService, public translate: TranslateService) {
    this.nzWidth = window.innerWidth > 767 ? window.innerWidth / 3 : window.innerWidth / 2.5;
  }

  doDownloadTemplate() {
    this.isSubmittedImport.emit(true);
    if (this.formImport && this.formImport?.invalid) {
      return;
    }
    this.isDownloadTemplate = true;
    const formData = new FormData();
    if (this.formImport) {
      this.doAppendFromImport(formData, this.formImport.value);
    }
    this.downLoadTemplateApi().subscribe((res: any) => {
      this.isDownloadTemplate = false;
    }, error => {
      this.isDownloadTemplate = false;
      this.toastrService.error(this.translate.instant('common.notification.downloadFileError') + `: ${error?.message}`);
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    if (file.size >= this.getFileSize(3) || !checkTypeExport(file.type)) {
      if (!checkTypeExport(file.type)) {
        this.toastrService.error(this.translate.instant('common.upload.fileError'));
      }
      if (file.size >= this.getFileSize(3)) {
        this.toastrService.error(this.translate.instant('common.notification.limitSize'));
      }
    } else {
      this.fileList = [];
      this.fileList = this.fileList.concat(file);
      this.isExistFileImport = true;
      this.fileImportName = file.name;
      this.fileImportSize = (file.size / this.getFileSize(10)).toFixed(3);
    }
    return false;
  };

  doDownloadFile() {
    this.subs.push(
      this.doDownloadFileByNameApi(UrlConstant.DOWNLOAD_FILE_ERROR, this.fileName).subscribe(() => {
        this.isHiddenDownloadErrorFile = false;
      }, error => {
        this.toastrService.error(error.message);
      })
    );
  }

  doAppendFromImport(formData: FormData, obj: any, isArr?: boolean, formKey?: string) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (Array.isArray(obj[key])) {
          this.doAppendFromImport(formData, obj[key], true, key);
        } else {
          if (isArr) {
            formData.append(formKey, obj[key] as any);
          } else {
            if (obj[key]) {
              formData.append(key, obj[key] as any);
            }
          }
        }
      }
    }
  }

  doImportFile() {
    this.isSubmittedImport.emit(true);
    if (this.formImport && this.formImport?.invalid) {
      return;
    }
    this.isImport = true;
    this.isHiddenDownloadErrorFile = true;
    const formData = new FormData();
    this.fileList.forEach((file: NzUploadFile) => {
      formData.append('file', file as any);
    });
    if (this.formImport) {
      this.doAppendFromImport(formData, this.formImport.value);
    }
    if (this.inputParam) {
      this.doAppendFromImport(formData, this.inputParam);
    }

    this.importApi(formData).subscribe(res => {
      if (res != null && res.data?.errorList) {
        this.errorList = res.data.errorList;
        if (this.errorList != null && this.errorList.length > 0) {
          this.isModalError = true;
          this.fileName = res.data.errorFile;
          this.isImport = false;
        } else {
          this.isModalError = false;
          this.errorList = [];
          this.fileName = undefined;
          // this.toastrService.error(res.message);
          this.isImport = false;
        }
      } else {
        if (this.isGetData) {
          this.getData.emit(res);
        }
        this.isModalError = false;
        this.errorList = [];
        this.fileName = undefined;
        this.doClose(true);
        this.toastrService.success(this.translate.instant('common.notification.fileSuccess'));
        this.isImport = false;
      }
    }, error => {
      if (error != null && error.data?.errorList) {
        this.errorList = error.data.errorList;
        if (this.errorList != null && this.errorList.length > 0) {
          this.isModalError = true;
          this.fileName = error.data.errorFile;
        } else {
          this.isModalError = false;
          this.errorList = [];
          this.fileName = undefined;
          // this.toastrService.error(error.message);
        }
      }
      this.isImport = false;

    });
  }

  doRemoveFile = (): boolean => {
    this.fileList = [];
    this.isExistFileImport = false;
    return true;
  };

  doCloseModal() {
    this.isModalError = false;
  }

  doClose(isSearch: boolean) {
    this.showContent = false;
    this.onCloseModal.emit(isSearch);
    this.fileImportName = '';
    this.isExistFileImport = false;
  }

  getFileSize(size: number) {
    return size * 1024 * 1024;
  }
}

export function checkTypeExport(typeFile: string): boolean {
  let type: boolean;
  switch (typeFile) {
    case Constant.EXCEL_MIME_1:
      type = true;
      break;
    case Constant.EXCEL_MIME_2:
      type = true;
      break;
    default:
      type = false;
      break;
  }
  return type;
}
