import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, Observer, Subscription } from 'rxjs';
import { PersonalInfo } from '@shared/model/personal-info';
import { PersonalInfoService } from '@shared/services/personal-info.service';
import { FunctionCode } from '@shared/enums/enums-constant';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { AppFunction } from '@core/models/app-function.interface';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { EmployeeRequestsService } from '@app/modules/hrm/data-access/services/staff-info/employee-requests.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { REQUEST_TYPE } from '@shared/constant/common';
import { EmployeesService } from '@app/modules/hrm/data-access/services/staff-info/employees.service';
import { AlertModalChangeService } from '@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service';

@Component({
  selector: 'app-header-info',
  templateUrl: './header-info.component.html',
  styleUrls: ['./header-info.component.scss']
})
export class HeaderInfoComponent extends BaseListComponent<NzSafeAny> implements OnInit, OnChanges {

  objFunction: AppFunction;
  avtBase64: string | NzSafeAny | ArrayBuffer = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  fileAvt: NzUploadXHRArgs | NzSafeAny;
  formDataAvt: FormData | NzSafeAny;
  dataHeader: any;
  avtIsLoading = true;
  showTmp = false;
  isHasAvatar = true;
  dataEmployee: any = {};
  isVisible = false;
  isBtnConfirm = false;


  subs: Subscription[] = [];

  @Input() data?: any;

  constructor(
    injector: Injector,
    private personalInfoService: PersonalInfoService,
    private employeeRequestService: EmployeeRequestsService,
    private alertModalChangeService: AlertModalChangeService,
    private employeeService: EmployeesService
  ) {
    super(injector);
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.HR_ALLOWANCE_PROCESS}`);
    this.exportApi = (params: any) => this.employeeService.export(params, UrlConstant.EMPLOYEES.EXPORT + UrlConstant.EMPLOYEES.PERSONAL, false);
  }

  ngOnInit(): void {
    this.getAvatar();
    this.getDataConfirm();
  }

  ngOnChanges(): void {
    if (this.data) {
      this.dataHeader = this.data?.infoBeans.find(item => item.infoType === 'BRIEF_INFO').details;
    }
  }

  getDataConfirm() {
    this.employeeRequestService.getList(null, UrlConstant.EMPLOYEE_REQUESTS.GET_UPDATE_INFO + UrlConstant.EMPLOYEES.PERSONAL_CT).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS && Object.keys(res.data).length !== 0) {
        this.dataEmployee = res.data;
        this.isBtnConfirm = true;
      } else {
        this.isBtnConfirm = false;
      }
    });
  }


  getAvatar(employeeId?: number | NzSafeAny) {
    this.avtIsLoading = true;
    this.subs.push(
      this.personalInfoService.getAvatar(employeeId).subscribe(res => {
        if (!res?.data) {
          this.isHasAvatar = false;
        }
        this.avtBase64 = res?.data ? 'data:image/jpg;base64,' + res?.data : 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        this.alertModalChangeService.saveAvatar(res?.data ? this.avtBase64 : null);
        this.avtIsLoading = false;
      })
    );
  }

  getIcon(code: string) {
    if (code === 'mobileNumber') {
      return 'phone';
    } else if (code === 'dateOfBirth') {
      return 'gift';
    } else if (code === 'personalIdNo') {
      return 'credit-card';
    } else if (code === 'empType') {
      return 'info';
    } else if (code === 'seniority') {
      return 'safety-certificate';
    }
  }

  beforeUpload = (file: NzUploadFile) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.toast.error(this.translate.instant('hrm.validate.fileType', { fileType: 'png, jpg' }));
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng);
      observer.complete();
    });
  };

  handleUpload = (item: NzUploadXHRArgs): NzSafeAny => {
    this.avtIsLoading = true;
    const formData = new FormData();
    formData.append('fileAvatar', item.file as unknown as File);
    this.formDataAvt = formData;
    this.fileAvt = item;
    const reader = new FileReader();
    reader.readAsDataURL(item.file as unknown as File);
    reader.onload = () => {
      this.avtBase64 = reader.result;
      this.avtIsLoading = false;
      this.showTmp = true;
    };
  };

  deleteAvt() {
    this.avtIsLoading = true;
    this.subs.push(
      this.personalInfoService.deleteAvatar(null, {}).subscribe(() => {
        this.alertModalChangeService.saveAvatar(null);
        this.avtBase64 = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        this.avtIsLoading = false;
        this.isHasAvatar = false;
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
      }, () => {
        this.avtIsLoading = false;
      })
    );
  }

  saveAvt() {
    if (this.fileAvt && this.formDataAvt) {
      this.avtIsLoading = true;
      this.subs.push(
        this.personalInfoService.uploadAvatar(null, this.formDataAvt).subscribe(() => {
          this.getAvatar();
          this.avtIsLoading = false;
          this.showTmp = false;
          this.fileAvt = null;
          this.formDataAvt = null;
          this.isHasAvatar = true;
          this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        })
      );
    }
  }

  doOpenConfirm() {
    this.isVisible = true;
  }

  handleOk(): void {
    this.dataEmployee.id = this.dataEmployee.employeeRequestId;
    this.employeeRequestService.update(this.dataEmployee, REQUEST_TYPE.DEFAULT, UrlConstant.EMPLOYEE_REQUESTS.UPDATE_EMPLOYEE + UrlConstant.EMPLOYEES.PERSONAL_CT).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(
          this.translate.instant('common.notification.updateSuccess')
        );
        this.getDataConfirm();
        this.isVisible = false;
      }
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  beforeExport() {

  }

  export() {
    this.exportApi(this.params).toPromise();
  }

  // showPersonInfo(employeeId: number | undefined, isAdvisorBuddy: boolean) {
  //   const title = isAdvisorBuddy ? 'hrm.staffManager.label.mentorTitle' : 'hrm.staffManager.label.menteeTitle';
  //   const data = {
  //     employeeId: employeeId
  //   }
  //   this.modal = this.modalService.create({
  //     nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
  //     nzTitle: this.translate.instant(title),
  //     nzContent: AdvisorBuddyInfoComponent,
  //     nzComponentParams: {data: data},
  //     nzFooter: null
  //   });
  // }

}
