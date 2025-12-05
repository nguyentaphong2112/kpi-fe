import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  ConfigParameterService
} from '@app/modules/admin/data-access/services/configurations/config-parameter.service';
import {
  ConfigFormComponent
} from '@app/modules/admin/pages/configurations/parameters/config-form/config-form.component';
import { Mode, TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import {
  ParameterFormComponent
} from '@app/modules/admin/pages/configurations/parameters/parameter-form/parameter-form.component';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { HbtTableComponent } from '@shared/component/hbt-table/hbt-table.component';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { format } from 'date-fns';
import { DataService } from '@shared/services/data.service';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';

@Component({
  selector: 'app-config-index',
  templateUrl: './config-index.component.html',
  styleUrls: ['./config-index.component.scss']
})
export class ConfigIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  listConfigParameter: any[];
  configGroupSelect: string;
  dataConfigGroup: any;
  lastDataId: any;
  moduleCode: string;


  @ViewChild('timeTmpl', { static: true }) timeTpl!: TemplateRef<any>;
  @ViewChild('tableComponent', { static: true }) tableComponent!: HbtTableComponent;

  constructor(injector: Injector,
              private configParameterService: ConfigParameterService,
              private dataService: DataService) {
    super(injector);
    this.functionCode = this.route.snapshot?.data['functionCode'];
    this.moduleCode = this.route?.snapshot?.data['moduleCode'];
    this.deleteApi = (id: number | string) =>
      this.configParameterService.deleteById(id.toString(), UrlConstant.PARAMETERS.SEARCH_PARAMETERS.replace('{configGroup}', this.dataConfigGroup?.configGroup));
    this.formConfig = {
      title: 'admin.configurations.parameters.label.titleConfig',
      content: ConfigFormComponent
    };
    this.initFormSearch();
  }


  protected readonly Mode = Mode;

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }


  override search() {
    this.configParameterService.getList({ moduleCode: this.moduleCode }, '').subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS && res.data.length > 0) {
          this.listConfigParameter = res.data;
          if (this.lastDataId) {
            this.dataConfigGroup = this.listConfigParameter.find(it => it.configParameterId === this.lastDataId);
            this.configGroupSelect = this.dataConfigGroup.configParameterId;
          } else {
            this.configGroupSelect = this.listConfigParameter[0]?.configParameterId;
            this.dataConfigGroup = this.listConfigParameter[0];
            this.lastDataId = this.configGroupSelect;
          }
          this.setHeaders();
          this.searchData();
        }
      }
    );
  }

  getData(data: NzSafeAny) {
    return { ...data, moduleCode: this.moduleCode };
  }

  selectConfigGroup(data: any) {
    if (this.lastDataId !== data.configParameterId) {
      this.configGroupSelect = data.configParameterId;
      this.dataConfigGroup = data;
      this.lastDataId = this.configGroupSelect;
      this.form.reset();
      this.setHeaders();
      this.tableComponent?.tableChangeDetection();
      this.searchData();
    }
  }

  initFormSearch() {
    this.form = this.fb.group({
      startDate: null,
      endDate: null
    }, {
      validators: [
        DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')
      ]
    });
  }


  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          function: (evt: any) => {
            this.openModal(Mode.EDIT, evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteItem
        })
      ]
    });
  }

  openModal(mode: Mode, data?: any) {
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzTitle: mode === Mode.ADD ? this.translate.instant('common.title.add') + ' ' + this.dataConfigGroup?.configGroupName
        : this.translate.instant('common.title.edit') + ' ' + this.dataConfigGroup?.configGroupName,
      nzContent: ParameterFormComponent,
      nzComponentParams: {
        mode,
        dataConfig: this.dataConfigGroup,
        data
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) =>
      result?.refresh ? this.searchData() : ''
    );
  }


  override setHeaders() {
    this.tableConfig = {
      headers: [
        {
          title: 'STT',
          thClassList: ['text-center'],
          tdClassList: ['text-center'],
          fixed: true,
          fixedDir: 'left',
          width: 50
        },
        {
          title: 'admin.configurations.parameters.label.time',
          fieldType: 'tdTemplate',
          fieldTypeValue: this.timeTpl,
          fixed: true,
          fixedDir: 'left',
          thClassList: ['text-center'],
          tdClassList: ['text-center'],
          width: 300
        },
        ...this.getHeader(),
        {
          title: '',
          field: 'action',
          tdClassList: ['text-nowrap', 'text-center'],
          thClassList: ['text-nowrap', 'text-center'],
          width: 80,
          fieldType: 'tdTemplate',
          fieldTypeValue: this.actionTpl,
          fixed: true,
          fixedDir: 'right'
        }
      ],
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1,
      showFrontPagination: false
    };
  }


  getHeader() {
    const listHeader: HBTTableHeader[] = [];
    this.dataConfigGroup?.columns?.forEach((column: any) => {
      const header: HBTTableHeader = {
        title: column.configName,
        field: column.configCode,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      };
      if (column.dataType === 'text') {
        header.width = 500;
      }
      listHeader.push(header);
    });
    return listHeader;
  }

  async searchData(page?: number) {
    if (this.form.valid) {
      this.pagination.pageNumber = page ?? 1;
      const startDate = this.form?.get('startDate')?.value ? format(this.form?.get('startDate')?.value, 'dd/MM/yyyy') : null;
      const endDate = this.form?.get('endDate')?.value ? format(this.form?.get('endDate')?.value, 'dd/MM/yyyy') : null;
      this.params = { startDate, endDate };
      const url = UrlConstant.PARAMETERS.SEARCH_PARAMETERS.replace('{configGroup}', this.dataConfigGroup?.configGroup);
      const res = await this.configParameterService.getFilterResearch(this.params, this.pagination.getCurrentPage(), url).toPromise();

      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        const listData = res.data?.listData || [];
        const dataCache: Record<string, any[]> = {};

        for (const item of listData) {
          if (this.dataConfigGroup?.configPeriodType !== 'DATE') {
            item.startDate = item.startDate?.substring(3);
            item.endDate = item.endDate ? item.endDate.substring(3) : null;
          }

          for (const column of item.columns || []) {
            if ((column.dataType?.toUpperCase() === 'MULTI_LIST' || column.dataType?.toUpperCase() === 'LIST') && column.urlLoadData) {
              const urlLoadData = column.urlLoadData;

              if (!dataCache[urlLoadData]) {
                const dataRes = await this.dataService.getData(urlLoadData, null).toPromise();
                if (dataRes.code === HTTP_STATUS_CODE.SUCCESS) {
                  dataCache[urlLoadData] = dataRes.data || [];
                } else {
                  dataCache[urlLoadData] = [];
                }
              }

              const configValues = column.configValue?.split(',').map((value: string) => value.trim()).filter((value: string) => value);
              const fillValue = dataCache[urlLoadData].filter((dataItem: NzSafeAny) => configValues?.includes(dataItem.value));
              item[column.configCode] = fillValue.map((dataItem: NzSafeAny) => dataItem.name).join(', ');
            } else {
              item[column.configCode] = column.configValue;
            }
          }
        }
        this.tableData = listData;
        this.tableConfig.pageIndex = this.pagination.pageNumber;
        this.tableConfig.total = res.data.total;
      }
    }
  }


}



