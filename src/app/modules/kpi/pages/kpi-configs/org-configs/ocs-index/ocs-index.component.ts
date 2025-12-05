import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { OcsFormComponent } from "@app/modules/kpi/pages/kpi-configs/org-configs/ocs-form/ocs-form.component";
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { ActionSchema, ChildActionSchema } from "@core/models/action.model";
import { Utils } from '@core/utils/utils';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { Mode, TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { CommonUtils } from '@shared/services/common-utils.service';
import { DataService } from '@shared/services/data.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { OrgConfigsModel } from '../../../../data-access/models/kpi-configs/org-configs.model';
import { OrgConfigsService } from '../../../../data-access/services/kpi-configs/org-configs.service';

@Component({
  selector: 'app-ocs-index',
  templateUrl: './ocs-index.component.html',
  styleUrls: ['./ocs-index.component.scss']
})


export class OcsIndexComponent extends BaseListComponent<OrgConfigsModel> implements OnInit {
  serviceName = MICRO_SERVICE.KPI;
  urlLoadData = '/org-configs';
  tableAttribute: HBTTableHeader[] = [];
  functionCode = Constant.FUNCTION_CODE.KPI_ORG_CONFIGS;
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: OrgConfigsService,
    private dataService: DataService,
  ) {
    super(injector);
    this.initFormSearch();
    this.getObjectAttribute().then()
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.serviceName = MICRO_SERVICE.KPI;
    this.key = 'orgConfigId';
    this.formConfig = {
      title:'kpi.orgConfigs.title',
      content:OcsFormComponent
    }
  }

  initFormSearch() {
    this.form = this.fb.group({
      year: [null],
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
    if (!this.isCustomSearch) {
      this.search();
    }
    this.isNotPageName = document.getElementsByClassName('inner-content--no-page-name').length > 0;
    this.onChangeYear()
  }

  onChangeYear() {
    const control = this.f.year;
    if(control){
      control.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
        .subscribe(newValue => {
          this.search()
        })
    }
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

  async getObjectAttribute(){
    const res = await firstValueFrom(this.dataService.getAttributeConfig({
      tableName:'kpi_org_configs'
    }));
    if (res.code === 'SUCCESS') {
      this.tableAttribute = res.data.map((item: NzSafeAny) => {
        const tableHeader: NzSafeAny = {
          title: item.name,
          field: item.code,
          width: 150,
          thClassList: ['text-center']
        }
        if (['date', 'long', 'double'].includes(item.dataType)) {
          tableHeader.tdClassList = ['text-center'];
          tableHeader.thClassList = ['text-center'];
          tableHeader.width = 100;
        }
        return tableHeader;
      });
      this.setHeaders();
    }

  }

  override beforeSearch() {
    this.params = {
      year:Utils.convertDateToSendServer(this.f.year.value,'yyyy')
    }
  }

  override beforeRenderTable() {
    this.responseSearch.data?.listData?.forEach(el => {
      el.listAttributes.forEach(att => {
        el[att.attributeCode] = att.attributeValue
      })
    });
  }

  get f() {
    return this.form.controls;
  }

  override beforeExport() {
  }



  override setHeaders() {
    this.tableConfig = {
      key: this.key,
      headers: [
        {
          title: 'STT',
          thClassList: ['text-center'],
          tdClassList: ['text-center'],
          fixed: true,
          fixedDir: 'left',
          width: 30
        },
        {
          title: 'kpi.orgConfigs.table.year',
          field: 'year',
          width: 50,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'kpi.orgConfigs.table.organization',
          field: 'orgName',
          width: 250
        },
        {
          title: 'kpi.orgConfigs.table.unitGroup',
          field: 'orgTypeName',
          width: 250
        },
        ...this.tableAttribute,
        {
          title: 'kpi.orgConfigs.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'kpi.orgConfigs.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'kpi.orgConfigs.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'kpi.orgConfigs.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'kpi.orgConfigs.table.lastUpdateTime',
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
      ],
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1,
      showFrontPagination: false
    }
  };
  protected readonly Mode = Mode;
}

