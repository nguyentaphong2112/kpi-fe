import {Component, Injector, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {WarningConfigsModel} from '../../../../data-access/models/configurations/warning-configs.model';
import {WarningConfigsService} from '../../../../data-access/services/configurations/warning-configs.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {WcsFormComponent} from "@app/modules/admin/pages/configurations/warning-configs/wcs-form/wcs-form.component";

@Component({
  selector: 'app-wcs-index',
  templateUrl: './wcs-index.component.html',
  styleUrls: ['./wcs-index.component.scss']
})


export class WcsIndexComponent extends BaseListComponent<WarningConfigsModel> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  urlLoadData = '/warning-configs';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: WarningConfigsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id?.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.FORM_DATA, '/import');
    this.serviceName = MICRO_SERVICE.ADMIN;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'warningConfigId';
    this.formConfig = {
      title: 'admin.configurations.warningConfigs.pageName',
      content: WcsFormComponent
    }
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
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
          title: 'admin.configurations.warningConfigs.table.title',
          field: 'title',
          width: 120,
        },
        {
          title: 'admin.configurations.warningConfigs.table.resource',
          field: 'resource',
          width: 120,
        },
        {
          title: 'admin.configurations.warningConfigs.table.backgroundColor',
          field: 'backgroundColor',
          width: 120,
        },
        {
          title: 'admin.configurations.warningConfigs.table.icon',
          field: 'icon',
          width: 120,
        },
        {
          title: 'admin.configurations.warningConfigs.table.apiUri',
          field: 'apiUri',
          width: 120,
        },
        {
          title: 'admin.configurations.warningConfigs.table.urlViewDetail',
          field: 'urlViewDetail',
          width: 120,
        },
        {
          title: 'admin.configurations.warningConfigs.table.sqlQuery',
          field: 'sqlQuery',
          width: 120,
          show: false
        },
        {
          title: 'admin.configurations.warningConfigs.table.isDeleted',
          field: 'isDeleted',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          show: false,
        },
        {
          title: 'admin.configurations.warningConfigs.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'admin.configurations.warningConfigs.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'admin.configurations.warningConfigs.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'admin.configurations.warningConfigs.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'admin.configurations.warningConfigs.table.lastUpdateTime',
          field: 'lastUpdateTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'admin.configurations.warningConfigs.table.isMustPositive',
          field: 'isMustPositive',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'admin.configurations.warningConfigs.table.orderNumber',
          field: 'orderNumber',
          width: 120,
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

