import { Component, Injector, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  RequestsFormComponent
} from '@app/modules/abs/pages/request-manager/requests/requests-form/requests-form.component';
import { UrlConstant } from '@app/modules/abs/data-access/constant/url.class';
import { Constant } from '@app/modules/abs/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { BaseListComponent } from '@core/components/base-list.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { Scopes } from '@core/utils/common-constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { RequestService } from '@app/modules/abs/data-access/services/request.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-requests-index',
  templateUrl: './requests-index.component.html',
  styleUrls: ['./requests-index.component.scss']
})

export class RequestsIndexComponent extends BaseListComponent<any> implements OnInit{
  moduleName = Constant.MODULE_NAME.REQUEST;
  functionCode: string = FunctionCode.ABS_REQUEST_MANAGER;
  isShowAdvSearch = false;
  urlConstant = UrlConstant;
  statusCodes = Constant.REQUESTS_STATUS;
  @ViewChild('attachFileTmpl', {static: true}) attachFile!: TemplateRef<any>;
  @Input() scope: string = Scopes.VIEW;

  actionSchemaHeader: ActionSchema;
  visibleActionsCount = 0;

  constructor(
    injector: Injector,
    private readonly service: RequestService
  ) {
    super(injector);
    this.initFormSearch();
    this.initAction();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import-process');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, {fileName: fileName});
    this.serviceName = MICRO_SERVICE.LMS;
    this.addWidth = 300;
    this.key = 'requestId';
    this.formConfig = {
      title: 'abs.breadcrumb.requestsLeave',
      content: RequestsFormComponent
    }
  }
  initFormSearch(){
    this.form = this.fb.group({
      keySearch: [null],
      status: [null],
      listStatus: [null],
      orgId :[null],
      listEmpTypeId: [null],
      listPositionId: [null],
      extendField: null,
      startTime :[null],
      endTime :[null],
      requestNo :[null],
      reasonTypeId :[null],
    });
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
          label: 'crm.customerCertificates.label.approve',
          icon: 'check',
          isShowFn: (evt: any) =>  [this.statusCodes.CHO_PHE_DUYET].includes(evt.status) && this.objFunction?.approve,
          function: (evt: any) => {
            this.updateStatus(Constant.REQUESTS_STATUS.DA_PHE_DUYET, evt.requestId);
          }
        })
      ]
    });
    this.actionSchemaHeader = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.approveAll',
          icon: 'check',
          isShow: this.objFunction?.approve,
          function: () => {
              this.approveAll()
          }
        }),
        new ChildActionSchema({
          label: 'common.button.export',
          icon: 'export',
          isShow: true,
          function: () => {
            this.export();
          }
        }),
        new ChildActionSchema({
          label: 'common.button.uploadFile',
          icon: 'import',
          isShow: true,
          function: () => {
            this.doImportData()
          }
        })
      ]
    });
    this.visibleActionsCount = this.actionSchemaHeader.arrAction.filter(it => it.isShow && it.isShowFn).length;

  }

  updateStatus(type: string, id: NzSafeAny) {
    this.service.createOrImport(null
    , REQUEST_TYPE.DEFAULT, UrlConstant.APPROVE_BY_LIST + `?listId=${id}`).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }

  approveAll() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.createOrImport(null, REQUEST_TYPE.DEFAULT, UrlConstant.APPROVE_ALL).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(
            this.translate.instant('common.notification.isApproveAll')
          );
          this.search();
        }
      });
    }
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
        title: 'abs.requests.table.employeeCode',
        field: 'employeeCode',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.requests.table.fullName',
        field: 'fullName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.requests.table.empTypeName',
        field: 'empTypeName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.requests.table.jobName',
        field: 'jobName',
        width: 120,
      },
      {
        title: 'abs.requests.table.organizationName',
        field: 'organizationName',
        width: 120,
      },
      {
        title: 'abs.requests.table.reasonTypeId',
        field: 'reasonTypeName',
        width: 120,
      },
      {
        title: 'abs.requests.table.startTime',
        field: 'startTime',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.requests.table.endTime',
        field: 'endTime',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.requests.table.status',
        field: 'statusName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },


      {
        title: 'abs.requests.table.createdBy',
        field: 'createdBy',
        width: 120,
        show: false,
      },
      {
        title: 'abs.requests.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.requests.table.modifiedBy',
        field: 'modifiedBy',
        width: 120,
        show: false,
      },
      {
        title: 'abs.requests.table.modifiedTime',
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
        fixed: window.innerWidth > 1024,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
      }
    ];

  }
}