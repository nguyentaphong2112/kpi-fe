import {Component, HostListener, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CustomerCareRecordsModel} from '../../../../data-access/models/order-managers/customer-care-records.model';
import {
  CustomerCareRecordsService
} from '../../../../data-access/services/order-managers/customer-care-records.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {Constant} from "@app/modules/crm/data-access/constants/constants";
import {
  CcrFormComponent
} from "@app/modules/crm/pages/order-managers/customer-care-records/ccr-form/ccr-form.component";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {EmployeesInfo} from "@app/modules/hrm/data-access/models/employee-info";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {EmployeesService} from "@app/modules/crm/data-access/services/hrm-managers/employees.service";

@Component({
  selector: 'app-ccr-index',
  templateUrl: './ccr-index.component.html',
  styleUrls: ['./ccr-index.component.scss']
})


export class CcrIndexComponent extends BaseListComponent<CustomerCareRecordsModel> implements OnInit {
  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = '/customer-care-records';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  isShowAdvSearch = false;
  functionCode = Constant.FUNCTION_CODE.CRM_CUSTOMER_CARE_RECORDS;
  employeesInfo: EmployeesInfo | NzSafeAny;
  actionSchemaHeader: ActionSchema;
  visibleActionsCount = 0;

  constructor(
    injector: Injector,
    private readonly service: CustomerCareRecordsService,
    private readonly serviceEmployee: EmployeesService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import-process');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, {fileName: fileName});
    this.serviceName = MICRO_SERVICE.CRM;
    this.key = 'customerCareRecordId';

    this.formConfig = {
      title: 'crm.breadcrumb.customerCareRecords',
      content: CcrFormComponent
    }
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      type:[null],
      requestedEmpId: [null],
      caringEmpId: [null]
    });
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
          label: 'common.button.view',
          icon: 'eye',
          isShow: this.objFunction?.view,
          function: this.doOpenFormDetail
        }),
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
        })
      ]
    });
    this.visibleActionsCount = this.actionSchemaHeader.arrAction.filter(it => it.isShow && it.isShowFn).length;
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
          title: 'crm.customerCareRecords.table.typeName',
          field: 'typeName',
          width: 120,
        },

        {
          title: 'crm.customerCareRecords.table.mobileNumber',
          field: 'mobileNumber',
          width: 120,
        },
        {
          title: 'crm.customerCareRecords.table.fullName',
          field: 'fullName',
          width: 120,
        },
        {
          title: 'crm.customerCareRecords.table.dateOfBirth',
          field: 'dateOfBirth',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.customerCareRecords.table.requestDate',
          field: 'requestDate',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.customerCareRecords.table.requestedEmpId',
          field: 'requestedEmpName',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.customerCareRecords.table.caringEmpId',
          field: 'caringEmpName',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.customerCareRecords.table.contactDate',
          field: 'contactDate',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.customerCareRecords.table.caringStatusId',
          field: 'caringStatusName',
          width: 120,
        },
        {
          title: 'crm.customerCareRecords.table.statusId',
          field: 'statusName',
          width: 120,
        },
        {
          title: 'crm.customerCareRecords.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'crm.customerCareRecords.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.customerCareRecords.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'crm.customerCareRecords.table.modifiedTime',
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
      ]
    };
  }

