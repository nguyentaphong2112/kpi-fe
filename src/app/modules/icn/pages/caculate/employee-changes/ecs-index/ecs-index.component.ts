import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EmployeeChangesModel } from '../../../../data-access/models/caculate/employee-changes.model';
import { EmployeeChangesService } from '../../../../data-access/services/caculate/employee-changes.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { CATEGORY_CODE, Mode, REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { Scopes } from '@core/utils/common-constants';
import { Validators } from '@angular/forms';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { FunctionCode } from '@shared/enums/enums-constant';
import {
  RequestsFormComponent
} from '@app/modules/abs/pages/request-manager/requests/requests-form/requests-form.component';
import { EcsFormComponent } from '@app/modules/icn/pages/caculate/employee-changes/ecs-form/ecs-form.component';

@Component({
  selector: 'app-ecs-index',
  templateUrl: './ecs-index.component.html',
  styleUrls: ['./ecs-index.component.scss']
})


export class EcsIndexComponent extends BaseListComponent<EmployeeChangesModel> implements OnInit {
  serviceName = MICRO_SERVICE.ICN;
  urlLoadData = '/employee-changes';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  isShowAdvSearch = false;
  scope = Scopes.CREATE;
  functionCode = FunctionCode.ICN_EMPLOYEE_CHANGES;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: EmployeeChangesService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.FORM_DATA, '/import');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
    this.approveByListApi = (listId: number[], afterUrl?: string) => this.service.approveByList(listId);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason);
    this.approveAllApi = (data: any, afterUrl?: string) => this.service.approveAll(CommonUtils.convertDataSendToServer(data));
    this.serviceName = MICRO_SERVICE.ICN;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'employeeChangeId';
    this.formConfig = {
      title: 'icn.employeeChanges.title',
      content: EcsFormComponent
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  initFormSearch() {
    this.form = this.fb.group({
        orgId: [null],
        periodDate: [new Date(), Validators.required],
        keySearch: [null],
        changeType: [null],
        contributionType: [null],
        status: [null]
      }
    );
  }

  onMakeList() {
    const form = CommonUtils.convertDataSendToServer(this.form.value);
    const data = { periodDate: form.periodDate };
    this.isLoading = true;
    this.service.onMakeList(data).subscribe(res => {
      this.isLoading = false;
      if (res && res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(res.message);
        this.search();
      }
    });

  }

  onApproveAll() {
    const data = CommonUtils.convertDataSendToServer(this.form.value);
    this.isLoading = true;
    this.service.approveAll(data).subscribe(res => {
      this.isLoading = false;
      if (res && res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(res.message);
        this.search();
      }
    });

  }

  onUndoApproveAll() {
    const data = CommonUtils.convertDataSendToServer(this.form.value);
    this.isLoading = true;
    this.service.undoApproveAll(data).subscribe(res => {
      this.isLoading = false;
      if (res && res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(res.message);
        this.search();
      }
    });

  }

  onApproveById(dataItem: any) {

    const data = { listId: [dataItem[this.key]] };
    this.isLoading = true;
    this.service.approveById(data).subscribe(res => {
      this.isLoading = false;
      if (res && res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(res.message);
        this.search();
      }
    });

  }

  onUndoApproveById(dataItem: any) {
    const data = { listId: [dataItem[this.key]] };
    this.isLoading = true;
    this.service.undoApproveById(data).subscribe(res => {
      this.isLoading = false;
      if (res && res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(res.message);
        this.search();
      }
    });

  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.approve',
          icon: 'check',
          isShowFn: (evt: any) => [Constant.STATUS.CHO_PHE_DUYET].includes(evt.status) && this.objFunction?.approve,
          function: (evt: any) => {
            this.onApproveById(evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShowFn: (evt: any) => [Constant.STATUS.CHO_PHE_DUYET].includes(evt.status) && this.objFunction?.edit,
          function: (evt: any) => {
            this.doOpenForm(Mode.EDIT, evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.rejectApprove',
          icon: 'close',
          isShowFn: (evt: any) => [Constant.STATUS.PHE_DUYET].includes(evt.status) && this.objFunction?.approve,
          function: (evt: any) => {
            this.onUndoApproveById(evt);
          }
        })
      ]
    });
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
        title: 'icn.employeeChanges.table.employeeCode',
        field: 'employeeCode',
        width: 100,
        thClassList: ['text-center']
      },
      {
        title: 'icn.employeeChanges.table.fullName',
        field: 'fullName',
        width: 200,
        thClassList: ['text-center']
      },
      {
        title: 'icn.employeeChanges.table.orgName',
        field: 'orgName',
        width: 200,
        thClassList: ['text-center']
      },
      {
        title: 'icn.employeeChanges.table.jobName',
        field: 'jobName',
        width: 150,
        thClassList: ['text-center']
      },
      {
        title: 'icn.employeeChanges.table.changeDate',
        field: 'changeDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'icn.employeeChanges.table.changeType',
        field: 'changeTypeName',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'icn.employeeChanges.table.contributionType',
        field: 'contributionTypeName',
        width: 150,
        thClassList: ['text-center']
      },
      {
        title: 'icn.employeeChanges.table.status',
        field: 'statusName',
        width: 150,
        thClassList: ['text-center'],
        tdClassList: ['text-center']
      },
      {
        title: '',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right'
      }
    ];
  };

  protected readonly CATEGORY_CODE = CATEGORY_CODE;
  protected readonly MICRO_SERVICE = MICRO_SERVICE;
}

