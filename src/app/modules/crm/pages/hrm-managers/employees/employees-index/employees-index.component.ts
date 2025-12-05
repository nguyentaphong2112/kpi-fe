import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EmployeesModel } from '../../../../data-access/models/hrm-managers/employees.model';
import { EmployeesService } from '../../../../data-access/services/hrm-managers/employees.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { EmployeesFormComponent } from '../employees-form/employees-form.component';
import { addYears, differenceInCalendarDays } from 'date-fns';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { PrintFormComponent } from '@app/modules/crm/ui/print-form/print-form.component';
import { LogActionComponent } from '@app/modules/crm/ui/log-action/log-action.component';
import { Constant } from '@app/modules/crm/data-access/constants/constants';

@Component({
  selector: 'app-employees-index',
  templateUrl: './employees-index.component.html',
  styleUrls: ['./employees-index.component.scss']
})
export class EmployeesIndexComponent extends BaseListComponent<EmployeesModel> implements OnInit {
  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = '/employees';
  isShowAdvSearch = false;
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  functionCode = Constant.FUNCTION_CODE.CRM_EMPLOYEES;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: EmployeesService
  ) {
    super(injector);
    this.initFormSearch();
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.addWidth = 300;
    this.key = 'employeeId';
    this.formConfig = {
      title: 'crm.employees.title',
      content: EmployeesFormComponent
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  initFormSearch() {
    this.form = this.fb.group({
      fullName: [null],
      dateOfBirth: [null],
      mobileNumber: [null],
    });
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
  }

  daysUntilNextBirthday(birthday: string) {
    if (!birthday) { return ''; }
    const today = new Date();
    const currentYear = today.getFullYear();

    // Tạo ngày sinh nhật cho năm hiện tại
    let nextBirthday = new Date(currentYear, Number(birthday.split('/')[1]), Number(birthday.split('/')[0]));

    // Nếu sinh nhật đã qua trong năm nay, tính sinh nhật năm tiếp theo
    if (today > nextBirthday) {
      nextBirthday = addYears(nextBirthday, 1);
    }

    // Tính số ngày còn lại đến sinh nhật
    return differenceInCalendarDays(nextBirthday, today);
  }

  override beforeExport() {
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction.edit,
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'crm.employees.table.printAction',
          icon: 'printer',
          function: this.print
        }),
        new ChildActionSchema({
          label: 'crm.employees.table.showHistoryAction',
          icon: 'eye',
          function: this.showHistory
        })
      ]
    });
  }

  print = (data: EmployeesModel) => {
    this.doOpenPrint(data.employeeId);
  }


  doOpenPrint(objId?: number) {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth(),
      nzTitle: this.translate.instant('crm.cskh.print'),
      nzContent: PrintFormComponent,
      nzComponentParams: {
        data: { objType: 'NHAN_VIEN', objId }
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

  showHistory = (data: EmployeesModel) => {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth(),
      nzTitle: this.translate.instant('crm.log-action.title'),
      nzContent: LogActionComponent,
      nzComponentParams: {
        data: { loginName: data.loginName }
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
        title: 'crm.employees.table.fullName',
        field: 'fullName',
        width: 200,
      },
      {
        title: 'crm.employees.table.mobileNumber',
        field: 'mobileNumber',
        width: 120,
      },
      {
        title: 'crm.employees.table.loginName',
        field: 'loginName',
        width: 120,
      },
      {
        title: 'crm.employees.table.positionTitleId',
        field: 'positionTitleName',
        width: 120,
      },
      {
        title: 'crm.employees.table.departmentId',
        field: 'departmentName',
        width: 120,
      },
      {
        title: 'crm.employees.table.dateOfBirth',
        field: 'dateOfBirth',
        width: 120,
        tdClassList: ['text-center'],
      },
      {
        title: 'crm.employees.table.managerId',
        field: 'managerName',
        width: 200,
      },
      {
        title: ' ',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
      }
    ];
  }
}

