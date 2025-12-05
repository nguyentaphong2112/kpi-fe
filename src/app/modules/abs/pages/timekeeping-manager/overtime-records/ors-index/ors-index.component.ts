import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OvertimeRecordsModel } from '../../../../data-access/models/timekeeping-manager/overtime-records.model';
import { OvertimeRecordsService } from '../../../../data-access/services/timekeeping-manager/overtime-records.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {_variable} from "@core/global-style/_variable";
import {FunctionCode} from "@shared/enums/enums-constant";
import {
  OrsFormComponent
} from "@app/modules/abs/pages/timekeeping-manager/overtime-records/ors-form/ors-form.component";

@Component({
  selector: 'app-ors-index',
  templateUrl: './ors-index.component.html',
  styleUrls: ['./ors-index.component.scss']
})


export class OrsIndexComponent extends BaseListComponent<OvertimeRecordsModel> implements OnInit {
  serviceName = MICRO_SERVICE.ABS;
  urlLoadData = '/overtime-records';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  functionCode = FunctionCode.ABS_OVERTIME_RECORDS
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;


  constructor(
    injector: Injector,
    private readonly service: OvertimeRecordsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.downLoadTemplateApi = () => this.service.downloadFile('/import-template');
    this.serviceName = MICRO_SERVICE.ABS;
    this.key = 'overtimeRecordId';
    this.formConfig={
      title:'abs.overtimeRecords.label.overtimeRecord',
      content:OrsFormComponent
    }
  }

  ngOnInit() {
    super.ngOnInit();
  }

  initFormSearch(){
    this.form = this.fb.group({
      keySearch: [null],
      startTime :[null],
      endTime :[null],
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
        width: 30
      },

        {
          title: 'abs.overtimeRecords.table.overtimeRecordId',
          field: 'overtimeRecordId',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          show:false
        },
        {
          title: 'abs.overtimeRecords.table.employeeCode',
          field: 'employeeCode',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
      {
        title: 'abs.overtimeRecords.table.fullName',
        field: 'fullName',
        width: 120,
        tdClassList: ['text-left'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.overtimeRecords.table.overtimeTypeName',
        field: 'overtimeTypeName',
        width: 120,
      },
        {
          title: 'abs.overtimeRecords.table.dateTimekeeping',
          field: 'dateTimekeeping',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.overtimeRecords.table.startTime',
          field: 'startTime',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.overtimeRecords.table.endTime',
          field: 'endTime',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
      {
        title: 'abs.overtimeRecords.table.content',
        field: 'content',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.overtimeRecords.table.jobName',
        field: 'jobName',
        width: 120,
        tdClassList: ['text-left'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.overtimeRecords.table.orgName',
        field: 'organizationName',
        width: 120,
        tdClassList: ['text-left'],
        thClassList: ['text-center']
      },
        {
          title: 'abs.overtimeRecords.table.totalHours',
          field: 'totalHours',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          show: false,
        },
        {
          title: 'abs.overtimeRecords.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'abs.overtimeRecords.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.overtimeRecords.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'abs.overtimeRecords.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.overtimeRecords.table.lastUpdateTime',
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
          show: this.objFunction?.delete || this.objFunction?.edit,
        }
      ]
    };
}

