import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {ErrorImport} from '@shared/model/error-import.interface';
import {
  WorkCalendarDetailsService
} from '@app/modules/abs/data-access/services/work_calendars/work-calendar-details.service';
import {ImportFormService} from '@shared/services/import-form.service';
import {beforeUploadFile} from '@shared/utils/utils';
import {HTTP_STATUS_CODE} from '@core/constant/system.constants';


@Component({
  selector: 'work-calendar-detail-import',
  templateUrl: './calendar-import.component.html',
  styleUrls: ['./calendar-import.component.scss']
})
export class CalendarImportComponent implements OnInit {

  @Input() showContent = false;
  @Input() workCalendarId?: number;
  @Input() closeModalWhenClick = true;
  @Input() leaveType = '';
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  isModalError = false;
  errorList: ErrorImport[] = [];
  fileList: NzUploadFile[] = [];
  fileName?: string;
  fileImportName = '';
  fileImportSize?: string;

  isExistFileImport = false;
  nzWidth: number;
  nzWidthError: number;

  constructor(
      private workCalendarDetailService: WorkCalendarDetailsService,
      private toastrService: ToastrService,
      private translate: TranslateService,
      private importFormService: ImportFormService
    ) {
    this.nzWidth = window.innerWidth > 767 ? window.innerWidth / 3 : window.innerWidth / 2.5;
    this.nzWidth = window.innerWidth > 767 ? window.innerWidth / 2 : window.innerWidth / 1.5;
  }

  ngOnInit(): void {
  }

  doClose(isSearch?: boolean) {
    this.fileList = [];
    this.showContent = false;
    this.onCloseModal.emit(isSearch);
    this.fileImportName = '';
    this.isExistFileImport = false;
  }

  doDownloadTemplate() {
    this.workCalendarDetailService.downloadFileTemplate().toPromise();
  }

  doCloseModal() {
    this.isModalError = false;
  }

  beforeUpload = (file: NzUploadFile) => {
    this.fileList = [];
    this.fileList = beforeUploadFile(file, this.fileList, 3000000, this.toastrService, this.translate, 'abs.notification.upload.limitSize');
    this.isExistFileImport = true;
    this.fileImportName = file.name;
    this.fileImportSize = ((file.size ?? 1) / 1000000).toFixed(2);
    return false;
  }

  doImportFile() {
    // Tạo form data
    const formData = new FormData();
    this.fileList.forEach((file: NzUploadFile) => {
      formData.append('file', file as any);
    });
    formData.append('workCalendarId', this.workCalendarId?.toString() ?? '');

    // Tiến hành import
    this.workCalendarDetailService.import(formData).subscribe(res => {
      if (res != undefined && res.code != HTTP_STATUS_CODE.OK) {
        this.errorList = res.data.errorList;
        if (this.errorList != undefined && this.errorList.length > 0) {
          this.isModalError = true;
          this.fileName = res.data.errorFile;
          this.toastrService.error(this.translate.instant('abs.notification.upload.error'));
        } else {
          this.isModalError = false;
          this.errorList = [];
          this.fileName = undefined;
          this.toastrService.error(res.message);
        }
      } else {
        this.isModalError = false;
        this.errorList = [];
        this.fileName = undefined;
        this.doClose(true);
        this.toastrService.success(this.translate.instant('abs.notification.upload.success'));
      }
    }, error => {
      this.toastrService.error(error.message);
    });
  }

  doRemoveFile = (): boolean => {
    this.fileList = [];
    this.isExistFileImport = false;
    return true;
  }
}
