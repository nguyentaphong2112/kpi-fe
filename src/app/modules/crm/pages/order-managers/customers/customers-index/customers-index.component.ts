import { Component, HostListener, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomersModel } from '../../../../data-access/models/order-managers/customers.model';
import { CustomersService } from '../../../../data-access/services/order-managers/customers.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { Constant } from '@app/modules/crm/data-access/constants/constants';
import {
  CustomersFormComponent
} from '@app/modules/crm/pages/order-managers/customers/customers-form/customers-form.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { EmployeesInfo } from '@app/modules/hrm/data-access/models/employee-info';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { PrintFormComponent } from '@app/modules/crm/ui/print-form/print-form.component';
import { EmployeesService } from '@app/modules/crm/data-access/services/hrm-managers/employees.service';
import { CareFormComponent } from '@app/modules/crm/pages/order-managers/customers/care-form/care-form.component';
import { LogActionFormComponent } from '@app/modules/crm/ui/log-action-form/log-action-form.component';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UrlConstant } from '@app/modules/crm/data-access/constants/url.class';

@Component({
  selector: 'app-customers-index',
  templateUrl: './customers-index.component.html',
  styleUrls: ['./customers-index.component.scss']
})


export class CustomersIndexComponent extends BaseListComponent<CustomersModel> implements OnInit {

  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = '/customers';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  employeesInfo: EmployeesInfo | NzSafeAny;
  actionSchemaHeader: ActionSchema;
  visibleActionsCount = 0;
  isVisible = false;
  isSubmittedModal = false;
  isShowAdvSearch = false;
  functionCode = Constant.FUNCTION_CODE.CRM_CUSTOMERS;
  nzWidth: number;

  constructor(
    injector: Injector,
    private readonly service: CustomersService,
    private readonly serviceEmployee: EmployeesService
  ) {
    super(injector);
    this.initFormSearch();
    this.initAction();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import-process');
    this.downLoadTemplateApi = () => this.service.downloadFile('/export-template');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, { fileName: fileName });
    this.setValidators();
    this.addWidth = 300;
    this.serviceName = MICRO_SERVICE.CRM;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'customerId';

    this.formConfig = {
      title: 'crm.breadcrumb.customer',
      content: CustomersFormComponent
    };
    this.nzWidth = window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5;
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      dateOfBirth: [null],
      introducerId: [null],
      userTakeCareId: [null],
      status: [null],
      objType: ['KHACH_HANG']
    });
    this.formImport = this.fb.group({
      courseId: [null, Validators.required],
      customerId: [null],
      instructorId: [null,Validators.required]
    });
  }



  public setValidators() {
    this.form.setValidators(this.validateTwoDate('startDate', 'endDate', 'rangeDateError'));
  }

  validateTwoDate(startDateKey: string, endDateKey: string, errorKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const startDate = formGroup.get(startDateKey)?.value;
      const endDate = formGroup.get(endDateKey)?.value;

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        const errors = { [errorKey]: true };
        formGroup.get(endDateKey)?.setErrors(errors);
        return errors;
      } else {
        formGroup.get(endDateKey)?.setErrors(null);
      }
      return null;
    };
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      // el.list = this.list;
    });
  }

  override beforeExport() {
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
    this.getPersonalInfo();
  }

  initAction() {
    this.actionSchemaHeader = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.uploadFile',
          icon: 'upload',
          isShow: this.objFunction?.import,
          function: () => {
            this.doImportData();
          }
        }),
        new ChildActionSchema({
          label: 'crm.printCard',
          icon: 'printer',
          isShow: true,
          function: () => {
            this.doOpenPrint();
          }
        }),
        new ChildActionSchema({
          label: 'common.button.export',
          icon: 'export',
          isShow: true,
          function: () => {
            this.export();
          }
        })
      ]
    });
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteItem
        }),
        new ChildActionSchema({
          label: 'crm.table.action.print',
          icon: 'printer',
          isShow: this.objFunction?.create,
          function: this.print
        }),
        new ChildActionSchema({
          label: 'crm.table.action.care',
          icon: 'whats-app',
          isShow: this.objFunction?.create,
          function: this.care
        }),
        new ChildActionSchema({
          label: 'crm.label.addCourse',
          icon: 'appstore-add',
          isShow: this.objFunction?.create,
          function: this.addCourse
        }),
        new ChildActionSchema({
          label: 'crm.table.action.log',
          icon: 'history',
          isShow: this.objFunction?.create,
          function: this.logAction
        })
      ]
    });
    this.visibleActionsCount = this.actionSchemaHeader.arrAction.filter(it => it.isShow && it.isShowFn).length;
  }

  private print = (data) => {
    this.doOpenPrint(data.customerId);
  };

  private care = (data) => {
    this.doOpenFormCare(data[this.key]);
  };

  private logAction = (data) => {
    this.doOpenFormLogActions(data[this.key]);
  };

  private addCourse = (data) => {
    this.doOpenFormCourse(data[this.key]);
  };


  doOpenFormCourse(objId?: number) {
    this.formImport.controls['customerId'].setValue(objId);
    this.isVisible = true;
  }

  handleOk() {
    this.isSubmittedModal = true;
    if (this.formImport.valid) {
      this.service.createOrImport(this.formImport.value, REQUEST_TYPE.DEFAULT, UrlConstant.CUSTOMER.COURSE).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(
            this.translate.instant('common.notification.addSuccess')
          );
          this.handleCancel();
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.formImport.reset();
    this.isSubmittedModal = false;
  }


  doOpenPrint(objId?: number) {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() + (this.addWidth ? this.addWidth : 0),
      nzTitle: this.translate.instant('crm.pageName.cardSample'),
      nzContent: PrintFormComponent,
      nzComponentParams: {
        data: { objType: this.form.controls['objType'].value, objId }
      },
      nzFooter: null
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.search(this.pagination.pageNumber);
        }
      }
    );
  }


  doOpenFormCare(id: number): void {
    const data = this.tableData.find(item => item[this.key] === id);
    if (data) {
      this.modalRef = this.modal.create({
        nzWidth: this.addWidth = 500,
        nzTitle: this.translate.instant('crm.pageName.care'),
        nzContent: CareFormComponent,
        nzComponentParams: {
          data
        },
        nzFooter: null
      });
      this.modalRef.afterClose.subscribe((result) => {
          if (result?.refresh) {
            this.search(this.pagination.pageNumber);
          }
        }
      );
    } else {
      this.toast.error(this.translate.instant('common.notification.recordNotFound'));
    }
  }

  doOpenFormLogActions(id: number): void {
    const data = this.tableData.find(item => item[this.key] === id);
    if (data) {
      data.listObjType = 'crm_customers,crm_family_relationships';
      data.id = id;
      this.modalRef = this.modal.create({
        nzWidth: this.getNzWidth() + (window.innerWidth > 1110 ? (window.innerWidth - 1110) / 3 : window.innerWidth / 4),
        nzTitle: this.translate.instant('crm.pageName.logAction'),
        nzContent: LogActionFormComponent,
        nzComponentParams: {
          data
        },
        nzFooter: null
      });
      this.modalRef.afterClose.subscribe((result) => {
      });
    } else {
      this.toast.error(this.translate.instant('common.notification.recordNotFound'));
    }
  }


  getPersonalInfo() {
    this.serviceEmployee.getListEmployee(null).subscribe((res: any) => {
      this.employeesInfo = res.data;
    });
  }


  override setHeaders() {
    this.tableConfig.key = this.key;
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50
      },
      {
        title: 'crm.customers.table.fullName',
        field: 'fullName',
        width: 200,
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customers.table.mobileNumber',
        field: 'mobileNumber',
        width: 110,
        tdClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customers.table.dateOfBirth',
        field: 'dateOfBirth',
        width: 100,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.customers.table.productName',
        field: 'productName',
        width: 225,
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customers.table.productPrice',
        field: 'productPrice',
        width: 100,
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        tdClassList: ['text-right'],
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.customers.table.owedAmount',
        field: 'owedAmount',
        width: 100,
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        tdClassList: ['text-right']
      },
      {
        title: 'crm.customers.table.referralFee',
        field: 'referralFee',
        width: 100,
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        tdClassList: ['text-right'],
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.customers.table.careFee',
        field: 'careFee',
        width: 100,
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        tdClassList: ['text-right'],
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.customers.table.welfareFee',
        field: 'welfareFee',
        width: 100,
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        tdClassList: ['text-right'],
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'crm.customers.table.introducerId',
        field: 'introducerName',
        width: 250,
        tdClassList: ['text-left'],
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customers.table.receiverId',
        field: 'receiverName',
        width: 250,
        tdClassList: ['text-left'],
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customers.table.userTakeCareId',
        field: 'userTakeCareName',
        width: 250,
        tdClassList: ['text-left'],
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customers.table.email',
        field: 'email',
        width: 250,
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customers.table.isStatusChild',
        field: 'isStatusChild',
        width: 75,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.customers.table.loginName',
        field: 'loginName',
        width: 110,
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.customers.table.genderId',
        field: 'genderName',
        width: 75
      },
      {
        title: 'crm.customers.table.zaloAccount',
        field: 'zaloAccount',
        width: 110
      },
      {
        title: 'crm.customers.table.job',
        field: 'job',
        width: 120
      },
      {
        title: 'crm.customers.table.departmentName',
        field: 'departmentName',
        width: 120
      },
      {
        title: 'crm.customers.table.bankAccount',
        field: 'bankAccount',
        width: 120
      },
      {
        title: 'crm.customers.table.bankName',
        field: 'bankName',
        width: 120
      },
      {
        title: 'crm.customers.table.bankBranch',
        field: 'bankBranch',
        width: 120
      },
      {
        title: 'crm.customers.table.status',
        field: 'statusName',
        width: 120
      },
      {
        title: 'crm.customers.table.createdBy',
        field: 'createdBy',
        width: 120,
        show: false
      },
      {
        title: 'crm.customers.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.customers.table.modifiedBy',
        field: 'modifiedBy',
        width: 120,
        show: false
      },
      {
        title: 'crm.customers.table.modifiedTime',
        field: 'modifiedTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: ' ',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit
      }
    ];
  };


  protected readonly length = length;
}

