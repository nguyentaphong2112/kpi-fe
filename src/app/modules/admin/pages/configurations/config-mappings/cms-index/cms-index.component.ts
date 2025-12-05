import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConfigMappingsModel } from '../../../../data-access/models/configurations/config-mappings.model';
import { ConfigMappingsService } from '../../../../data-access/services/configurations/config-mappings.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";

@Component({
  selector: 'app-cms-index',
  templateUrl: './cms-index.component.html',
  styleUrls: ['./cms-index.component.scss']
})


export class CmsIndexComponent extends BaseListComponent<ConfigMappingsModel> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  urlLoadData = '/config-mappings';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: ConfigMappingsService
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
    this.serviceName = MICRO_SERVICE.ADMIN;
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
        title: 'admin.configMappings.table.configMappingId',
        field: 'configMappingId',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'admin.configMappings.table.code',
        field: 'code',
        width: 120,
      },
      {
        title: 'admin.configMappings.table.name',
        field: 'name',
        width: 120,
      },
      {
        title: 'admin.configMappings.table.parameterTitle',
        field: 'parameterTitle',
        width: 120,
      },
      {
        title: 'admin.configMappings.table.valueTitle',
        field: 'valueTitle',
        width: 120,
      },
      {
        title: 'admin.configMappings.table.dataType',
        field: 'dataType',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'admin.configMappings.table.isDeleted',
        field: 'isDeleted',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'admin.configMappings.table.createdBy',
        field: 'createdBy',
        width: 120,
        show: false,
      },
      {
        title: 'admin.configMappings.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'admin.configMappings.table.modifiedBy',
        field: 'modifiedBy',
        width: 120,
        show: false,
      },
      {
        title: 'admin.configMappings.table.modifiedTime',
        field: 'modifiedTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'admin.configMappings.table.lastUpdateTime',
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
