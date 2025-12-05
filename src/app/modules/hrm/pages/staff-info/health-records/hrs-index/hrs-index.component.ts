import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HealthRecordsModel } from '../../../../data-access/models/staff-info/health-records.model';
import { HealthRecordsService } from '../../../../data-access/services/staff-info/health-records.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {Constant} from "@app/modules/abs/data-access/constant/constant.class";
import {FunctionCode} from "@shared/enums/enums-constant";
import {sFormComponent} from "@app/modules/hrm/pages/staff-info/health-records/hrs-form/hrs-form.component";
import {DataService} from "@shared/services/data.service";
import {CategoriesService} from "@app/modules/kpi/data-access/other-services/categories.service";
import {UrlConstant} from "@app/modules/kpi/data-access/constants/url.constant";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-hrs-index',
  templateUrl: './hrs-index.component.html',
  styleUrls: ['./hrs-index.component.scss']
})


export class sIndexComponent extends BaseListComponent<HealthRecordsModel> implements OnInit {
  serviceName = MICRO_SERVICE.HRM;
  urlLoadData = '/health-records';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  functionCode = FunctionCode.HR_HEALTH_RECORDS;
  listDisease:any;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  @ViewChild('diseaseTmpl', { static: true }) diseaseTmpl!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: HealthRecordsService,
    private readonly categoryService: CategoriesService,
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, `/import-process/${this.formImport.value.examinationPeriodId}`);
    this.downLoadTemplateApi = () => this.service.downloadFile(`/download-template/${this.formImport.value.examinationPeriodId}`);
    this.doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
    this.serviceName = MICRO_SERVICE.HRM;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'healthRecordId';
    this.formConfig = {
      title:'hrm.healthRecords.title',
      content: sFormComponent
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction()
  }

  initFormSearch() {
    this.form = this.fb.group({
      examinationPeriodId:[null],
      employeeCode:[null]
    });
    this.initFormImport()
  }

  initFormImport() {
    this.formImport = this.fb.group({
      examinationPeriodId: [null, [Validators.required]],
    });
  }

  afterCloseImport() {
    this.formImport.reset();
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
      ]
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
          width: 40
        },
        {
          title: 'hrm.healthRecords.table.employeeCode',
          field: 'employeeCode',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'hrm.healthRecords.table.employeeName',
          field: 'employeeName',
          width: 120,
          thClassList: ['text-center']
        },
        {
          title: 'hrm.healthRecords.table.dateOfBirth',
          field: 'dateOfBirth',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'hrm.healthRecords.table.genderName',
          field: 'genderName',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'hrm.healthRecords.table.examinationDate',
          field: 'examinationDate',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'hrm.healthRecords.table.examinationPeriod',
          field: 'examinationPeriodName',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'hrm.healthRecords.table.result',
          field: 'resultName',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'hrm.healthRecords.table.disease',
          field: 'diseaseNames',
          width: 120,
        },
        {
          title: 'hrm.healthRecords.table.jobName',
          field: 'jobName',
          width: 120,
          thClassList: ['text-center']
        },
        {
          title: 'hrm.healthRecords.table.orgName',
          field: 'orgName',
          width: 200,
          thClassList: ['text-center']
        },
        {
          title: 'hrm.healthRecords.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'hrm.healthRecords.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'hrm.healthRecords.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'hrm.healthRecords.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'hrm.healthRecords.table.lastUpdateTime',
          field: 'lastUpdateTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'common.label.attachFile',
          field: 'attachFileList',
          width: 250,
          show: false,
          fieldType: 'tdTemplate',
          fieldTypeValue: this.attachFile
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

  protected readonly Mode = Mode;
}

