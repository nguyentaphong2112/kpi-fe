import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConfigChartsModel } from '../../../../data-access/models/configurations/config-charts.model';
import { ConfigChartsService } from '../../../../data-access/services/configurations/config-charts.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {FunctionCode} from "@shared/enums/enums-constant";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {CcsFormComponent} from "@app/modules/admin/pages/configurations/config-charts/ccs-form/ccs-form.component";
import {StorageService} from "@core/services/storage.service";
import {of} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Component({
  selector: 'app-ccs-index',
  templateUrl: './ccs-index.component.html',
  styleUrls: ['./ccs-index.component.scss']
})


export class CcsIndexComponent extends BaseListComponent<ConfigChartsModel> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  urlLoadData = '/config-charts';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  functionCode = FunctionCode.SYS_CONFIG_CHART;
  arrChart:ConfigChartsModel[];
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: ConfigChartsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.serviceName = MICRO_SERVICE.ADMIN;
    this.key = 'configChartId';
    this.formConfig = {
      title : "admin.configCharts.title",
      content : CcsFormComponent
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction()
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

  initAction() {
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
        title: 'admin.configCharts.table.orderNumber',
        field: 'orderNumber',
        width: 120,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
        {
          title: 'admin.configCharts.table.code',
          field: 'code',
          width: 120,
        },
        {
          title: 'admin.configCharts.table.name',
          field: 'name',
          width: 120,
        },
        {
          title: 'admin.configCharts.table.type',
          field: 'typeName',
          width: 120,
        },
        {
          title: 'admin.configCharts.table.url',
          field: 'url',
          width: 120,
        },
      {
        title: 'admin.configCharts.table.serviceName',
        field: 'serviceName',
        width: 120,
      },
      {
        title: 'admin.configCharts.table.sqlQuery',
        field: 'sqlQuery',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        show:false
      },
        {
          title: 'admin.configCharts.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'admin.configCharts.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'admin.configCharts.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'admin.configCharts.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'admin.configCharts.table.lastUpdateTime',
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

