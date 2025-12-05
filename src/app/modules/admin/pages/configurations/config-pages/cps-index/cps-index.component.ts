import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConfigPagesModel } from '../../../../data-access/models/configurations/config-pages.model';
import { ConfigPagesService } from '../../../../data-access/services/configurations/config-pages.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {CpsFormComponent} from "@app/modules/admin/pages/configurations/config-pages/cps-form/cps-form.component";
import {FunctionCode} from "@shared/enums/enums-constant";
import {ObjectUtil} from "@core/utils/object.util";
import {Constant} from "@app/modules/admin/data-access/constants/constant";
import {NzSafeAny} from "ng-zorro-antd/core/types";

@Component({
  selector: 'app-cps-index',
  templateUrl: './cps-index.component.html',
  styleUrls: ['./cps-index.component.scss']
})


export class CpsIndexComponent extends BaseListComponent<ConfigPagesModel> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  urlLoadData = '/config-pages';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  functionCode = FunctionCode.SYS_CONFIG_PAGE;
  listConfigPageType:NzSafeAny[];
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  @ViewChild('typeTmpl', { static: true }) typeTmpl!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: ConfigPagesService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.FORM_DATA, '/import');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
    this.listConfigPageType = ObjectUtil.optionsToList(Constant.LIST_CONFIG_PAGE_TYPE,this.translate);
    this.serviceName = MICRO_SERVICE.ADMIN;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'configPageId';
    this.formConfig = {
      content:CpsFormComponent,
      title:'admin.configPages.label.configPage'
    }

  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);

  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch:[null]
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
        width: 60
      },

        {
          title: 'admin.configPages.table.configPageId',
          field: 'configPageId',
          width: 120,
          show:false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'admin.configPages.table.url',
          field: 'url',
          width: 220,
        },
        {
          title: 'admin.configPages.table.reportCodes',
          field: 'reportCodes',
          width: 250,
        },
        {
          title: 'admin.configPages.table.type',
          fieldType:"tdTemplate",
          fieldTypeValue:this.typeTmpl,
          width: 120,
        },
        {
          title: 'admin.configPages.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false
        },
        {
          title: 'admin.configPages.table.createdTime',
          field: 'createdTime',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          show: false
        },
        {
          title: 'admin.configPages.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false
        },
        {
          title: 'admin.configPages.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          show: false
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

