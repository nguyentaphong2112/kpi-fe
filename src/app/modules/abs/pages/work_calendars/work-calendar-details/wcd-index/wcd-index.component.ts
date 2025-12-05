import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkCalendarDetailsModel } from '../../../../data-access/models/work_calendars/work-calendar-details.model';
import { WorkCalendarDetailsService } from '../../../../data-access/services/work_calendars/work-calendar-details.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {WcsFormComponent} from "@app/modules/abs/pages/category-manager/work-calendars/wcs-form/wcs-form.component";
import {
  WcdFormComponent
} from "@app/modules/abs/pages/work_calendars/work-calendar-details/wcd-form/wcd-form.component";

@Component({
  selector: 'app-wcd-index',
  templateUrl: './wcd-index.component.html',
  styleUrls: ['./wcd-index.component.scss']
})


export class WcdIndexComponent extends BaseListComponent<WorkCalendarDetailsModel> implements OnInit {
  serviceName = MICRO_SERVICE.ABS;
  urlLoadData = '/work-calendar-details';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  isLoading = false;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: WorkCalendarDetailsService
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

    this.formConfig = {
      title: 'abs.breadcrumb.requestsLeave',
      content: WcdFormComponent
    };
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
        width: 50
      },

        {
          title: 'abs.workCalendarDetails.table.workCalendarDetailId',
          field: 'workCalendarDetailId',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendarDetails.table.workCalendarId',
          field: 'workCalendarId',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendarDetails.table.dateTimekeeping',
          field: 'dateTimekeeping',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendarDetails.table.workdayTimeId',
          field: 'workdayTimeId',
          width: 120,
        },
        {
          title: 'abs.workCalendarDetails.table.description',
          field: 'description',
          width: 120,
        },
        {
          title: 'abs.workCalendarDetails.table.isDeleted',
          field: 'isDeleted',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendarDetails.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'abs.workCalendarDetails.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendarDetails.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'abs.workCalendarDetails.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'abs.workCalendarDetails.table.lastUpdateTime',
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

