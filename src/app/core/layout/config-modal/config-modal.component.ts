import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  ConfigParameterService
} from '@app/modules/admin/data-access/services/configurations/config-parameter.service';
import { FunctionCode } from '@shared/enums/enums-constant';
import { HbtTableComponent } from '@shared/component/hbt-table/hbt-table.component';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import {
  ConfigFormComponent
} from '@app/modules/admin/pages/configurations/parameters/config-form/config-form.component';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import {
  ParameterFormComponent
} from '@app/modules/admin/pages/configurations/parameters/parameter-form/parameter-form.component';
import { Mode, TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { format } from 'date-fns';

@Component({
  selector: 'app-config-modal',
  templateUrl: './config-modal.component.html',
  styleUrls: ['./config-modal.component.scss']
})
export class ConfigModalComponent extends BaseListComponent<NzSafeAny> implements OnInit {

  listConfigParameter: any[];
  configGroupSelect: string;
  dataConfigGroup: any;
  lastDataId: any;
  moduleCode: string;
  functionCode = FunctionCode.SYS_CONFIG_PARAMETER;
  data: any;


  @ViewChild('timeTmpl', { static: true }) timeTpl!: TemplateRef<any>;
  @ViewChild('tableComponent', { static: true }) tableComponent!: HbtTableComponent;

  constructor(injector: Injector,
              private configParameterService: ConfigParameterService) {
    super(injector);
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
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.search();
    this.initAction();
  }


  override search() {
    this.moduleCode = this.route.snapshot.queryParams.moduleCode;
    this.listConfigParameter = [this.data];
    this.configGroupSelect = this.data?.configParameterId;
    this.dataConfigGroup = this.data;
    this.lastDataId = this.configGroupSelect;
    this.setHeaders();
    this.searchData();
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
      listHeader.push(header);
    });
    return listHeader;
  }

  searchData(page?: number) {
    this.pagination.pageNumber = page ?? 1;
    const startDate = this.form?.get('startDate')?.value ? format(this.form?.get('startDate')?.value, this.dataConfigGroup?.configPeriodType !== 'DATE' ? 'MM/yyyy' : 'dd/MM/yyyy') : null;
    const endDate = this.form?.get('endDate')?.value ? format(this.form?.get('endDate')?.value, this.dataConfigGroup?.configPeriodType !== 'DATE' ? 'MM/yyyy' : 'dd/MM/yyyy') : null;
    this.params = { startDate, endDate };
    const url = UrlConstant.PARAMETERS.SEARCH_PARAMETERS.replace('{configGroup}', this.dataConfigGroup?.configGroup);
    this.configParameterService.getFilterResearch(this.params, this.pagination.getCurrentPage(), url).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        res.data?.listData.forEach((item) => {
          if (this.dataConfigGroup?.configPeriodType !== 'DATE') {
            item.startDate = item.startDate.substring(3);
            item.endDate = item.endDate ? item.endDate.substring(3) : null;
          }
          item.columns.forEach((column) => {
            item[column.configCode] = column.configValue;
          });
        });
        this.tableData = res.data.listData;
        this.tableConfig.total = res.data.total;
        this.tableConfig.pageIndex = res.data.pageIndex;
      }
    });
  }

}
