import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkCalendarsModel } from '../../../../data-access/models/work_calendars/work-calendars.model';
import { WorkCalendarsService } from '../../../../data-access/services/work_calendars/work-calendars.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";

@Component({
  selector: 'app-wcs-index',
  templateUrl: './wcs-index.component.html',
  styleUrls: ['./wcs-index.component.scss']
})


export class WcsIndexComponent extends BaseListComponent<WorkCalendarsModel> implements OnInit {
  serviceName = MICRO_SERVICE.ABS;
  urlLoadData = '/work-calendars';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: WorkCalendarsService
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
    this.serviceName = MICRO_SERVICE.ABS;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'resourceId';
  }

  initFormSearch() {
    this.form = this.fb.group({
      code: [null],
      flagStatus: [1],
      flagStatus1: [],
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
    this.tableConfig.showSelect = true;
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 20
      },

        {
          title: 'abs.workCalendars.table.workCalendarId',
          field: 'workCalendarId',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendars.table.name',
          field: 'name',
          width: 120,
        },
        {
          title: 'abs.workCalendars.table.monWorkTimeId',
          field: 'monWorkTimeId',
          width: 120,
        },
        {
          title: 'abs.workCalendars.table.tueWorkTimeId',
          field: 'tueWorkTimeId',
          width: 120,
        },
        {
          title: 'abs.workCalendars.table.wedWorkTimeId',
          field: 'wedWorkTimeId',
          width: 120,
        },
        {
          title: 'abs.workCalendars.table.thuWorkTimeId',
          field: 'thuWorkTimeId',
          width: 120,
        },
        {
          title: 'abs.workCalendars.table.friWorkTimeId',
          field: 'friWorkTimeId',
          width: 120,
        },
        {
          title: 'abs.workCalendars.table.satWorkTimeId',
          field: 'satWorkTimeId',
          width: 120,
        },
        {
          title: 'abs.workCalendars.table.sunWorkTimeId',
          field: 'sunWorkTimeId',
          width: 120,
        },
        {
          title: 'abs.workCalendars.table.defaultHodidayDate',
          field: 'defaultHodidayDate',
          width: 120,
        },
        {
          title: 'abs.workCalendars.table.startDate',
          field: 'startDate',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendars.table.endDate',
          field: 'endDate',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendars.table.isDeleted',
          field: 'isDeleted',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendars.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'abs.workCalendars.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendars.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'abs.workCalendars.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendars.table.lastUpdateTime',
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
  }

