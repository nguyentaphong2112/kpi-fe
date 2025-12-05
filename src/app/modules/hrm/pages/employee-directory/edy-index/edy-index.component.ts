import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { Subscription } from 'rxjs';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { FunctionCode } from '@shared/enums/enums-constant';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { EmployeeDetail } from '@app/modules/hrm/data-access/models/personal-info';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { EmployeesService } from '@app/modules/hrm/data-access/services/staff-research/employees.service';
import { Scopes } from '@core/utils/common-constants';
import { EdyCardComponent } from '@app/modules/hrm/pages/employee-directory/edy-card/edy-card.component';

@Component({
  selector: 'app-edy-index',
  templateUrl: './edy-index.component.html',
  styleUrls: ['./edy-index.component.scss']
})
export class EdyIndexComponent extends BaseListComponent<EmployeeDetail> implements OnInit {
  subs: Subscription[] = [];
  urlConstantShare = UrlConstantShare;
  isShowAdvSearch = false;
  functionCode = FunctionCode.HR_EMPLOYEE_DIRECTORY;
  scope = Scopes.VIEW;

  constructor(
    injector: Injector,
    private readonly service: EmployeesService
  ) {
    super(injector);
    this.initFormSearch();
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination, '/directory');
    this.formConfig = {
      title: ' ',
      content: EdyCardComponent
    };
    this.key = 'employeeId';
    this.serviceName = MICRO_SERVICE.HRM;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }



  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'eye',
          isShow: this.objFunction?.view,
          disabled: () => {
            return false;
          },
          function: this.doOpenFormEdit
        })
      ]
    });
  }

  initFormSearch() {
    this.form = this.fb.group({
        keySearch: null,
        organizationId: null,
        listPositionId: null
      }
    );
  }

  initDataSelect() {

  }

  override setHeaders() {
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
        title: 'hrm.employeeDirectory.empCode',
        thClassList: ['text-center'],
        field: 'employeeCode',
        width: 150
      },
      {
        title: 'hrm.employeeDirectory.fullName',
        thClassList: ['text-center'],
        field: 'fullName',
        width: 180
      },
      {
        title: 'hrm.employeeDirectory.yearOfBirth',
        field: 'yearOfBirth',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 120
      },
      {
        title: 'hrm.employeeDirectory.email',
        field: 'email',
        thClassList: ['text-center'],
        width: 200
      },
      {
        title: 'hrm.employeeDirectory.mobileNumber',
        field: 'mobileNumber',
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.employeeDirectory.jobName',
        thClassList: ['text-center'],
        field: 'jobName',
        width: 300
      },
      {
        title: 'hrm.employeeDirectory.orgName',
        field: 'orgName',
        thClassList: ['text-center'],
        width: 300
      },
      {
        title: '',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }

  doViewDetail(data: EmployeeDetail) {
    this.modalRef = this.modal.create({
      nzWidth: '800px',
      nzTitle: '',
      nzContent: this.formConfig.content,
      nzMaskClosable: this.formConfig.isCloseModal,
      nzComponentParams: {
        data,
        config: this.formConfig.config
      },
      nzFooter: null
    });
  }
}