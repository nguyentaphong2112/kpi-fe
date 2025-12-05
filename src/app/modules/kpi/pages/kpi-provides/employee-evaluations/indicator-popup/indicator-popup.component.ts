import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { Validators } from '@angular/forms';
import {
  EmployeeEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/employee-evaluations.service';
import {
  IndicatorConversionsService
} from '@app/modules/kpi/data-access/services/kpi-managers/indicator-conversions.service';
import { HBTTableConfig, HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { Pagination } from '@shared/model/pagination';
import { CatalogModel } from '@shared/model/catalog-model';
import { CategoriesService } from '@app/modules/admin/data-access/services/categories/categories.service';
import { JobsService } from '@app/modules/hrm/data-access/services/model-plan/jobs.service';
import { OrgService } from '@app/modules/hrm/data-access/services/model-plan/org.service';
import { distinctUntilChanged } from 'rxjs';
import { $e } from 'codelyzer/angular/styles/chars';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-indicator-popup',
  templateUrl: './indicator-popup.component.html',
  styleUrls: ['./indicator-popup.component.scss']
})
export class IndicatorPopupComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  listOrgChild = [];
  listJob = [];
  listOrg = [];
  listConversion: CatalogModel[] = [];
  org = false;
  tableConfig: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };
  tableData: any[] = [];
  params: any = {};
  pagination = new Pagination();
  listId: any[] = [];
  listData: any[] = [];
  orgId = null;
  isEmp = false;


  @ViewChild('significanceTpl', { static: true }) significanceTpl!: TemplateRef<any>;
  @ViewChild('measurementTpl', { static: true }) measurementTpl!: TemplateRef<any>;
  @ViewChild('systemInfoTpl', { static: true }) systemInfoTpl!: TemplateRef<any>;
  @ViewChild('relatedNameTpl', { static: true }) relatedNameTpl!: TemplateRef<any>;
  @ViewChild('scopeNameTpl', { static: true }) scopeNameTpl!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: EmployeeEvaluationsService,
    private categoryService: CategoriesService,
    private jobsService: JobsService,
    private orgService: DataService,
    private readonly conversionService: IndicatorConversionsService
  ) {
    super(injector);
    this.initConversion();
  }

  ngOnInit() {
    this.initFormSearch();
    this.data = this.data.filter(value => value !== null && value !== undefined);
    if (!this.org) {
      this.conversionService.getList(null, UrlConstant.INDICATOR_CONVERSION.GET_ORG_LIST + this.route.snapshot.queryParams.employeeId).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listOrg = res.data;
          if (res.data.length > 0 && this.data?.length > 0) {
            this.f['organizationId'].setValue(this.listOrg[0].organizationId);
            this.search(1, null, this.data);
          }
        }
      });
    }
    if (this.org) {
      this.search(1, this.data);
    }
  };

  getJobList($event: NzSafeAny) {
    this.jobsService.getList({
      jobType: 'VI_TRI_VIEC_LAM',
      organizationId: $event
    }, UrlConstant.JOBS.VI_TRI_VIEC_LAM_SUB).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listJob = res.data;
      }
    });
  }

  getOrgChild($event: NzSafeAny) {
    this.orgService.getData(UrlConstant.ORGANIZATIONS.LOAD_CHILDREN + '/' + $event, MICRO_SERVICE.HRM).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listOrgChild = res.data;
      }
    });
  }


  initFormSearch() {
    this.form = this.fb.group({
      jobId: [null, this.org ? null : Validators.required],
      organizationId: [this.org ? this.orgId : null, this.org ? null : Validators.required],
      orgChildId: [null],
      name: [null]
    });
    this.f.organizationId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      if (value) {
        this.getOrgChild(value);
        this.getJobList(value);
      }
      this.f['orgChildId'].setValue(null);
      this.f['jobId'].setValue(null);
    });

    this.f.orgChildId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      if (value) {
        this.getJobList(value);
      } else {
        this.getJobList(this.f['organizationId'].value);
      }
      this.f['jobId'].setValue(null);
    });

  }

  initConversion() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_THANG_DO)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listConversion = res.data;
        this.setHeaders();
      }
    });
  }

  // getListOrgType($event) {
  //   if ($event) {
  //     this.conversionService.getList({ organizationId: $event }, UrlConstant.INDICATOR_CONVERSION.ORGANIZATION_LIST2).subscribe(res => {
  //       if (res.code === HTTP_STATUS_CODE.SUCCESS) {
  //         this.listOrgType = res.data;
  //       }
  //     });
  //   } else {
  //     this.listOrgType = [];
  //   }
  //   this.resetTable();
  //   this.form.controls.orgTypeId.setValue(null);
  // }

  resetTable() {
    this.tableData = [];
    this.tableConfig.total = 0;
    this.tableConfig.pageIndex = 1;
  }

  getListJob($event) {
    if ($event) {
      this.conversionService.getList({
        organizationId: this.form.controls.organizationId.value,
        orgTypeId: $event
      }, UrlConstant.INDICATOR_CONVERSION.ORGANIZATION_LIST2).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listJob = res.data;
        }
      });
    } else {
      this.listJob = [];
    }
    this.resetTable();
    this.form.controls.jobId.setValue(null);
  }

  setHeaders() {
    this.tableConfig = {
      headers: [
        {
          title: 'STT',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 50,
          rowspan: 2
        },
        {
          title: 'kpi.indicatorConversions.table.name',
          field: 'indicatorName',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 200,
          rowspan: 2
        },
        {
          title: 'kpi.indicators.table.type',
          field: 'typeName',
          rowspan: 2,
          width: 120
        },
        {
          title: 'kpi.indicatorConversions.table.unitId',
          field: 'unitName',
          rowspan: 2,
          width: 120
        },
        {
          title: 'kpi.indicatorConversions.table.periodType',
          field: 'periodTypeName',
          rowspan: 2,
          width: 120
        },
        {
          title: 'kpi.indicatorConversions.table.scaleInterpretation',
          colspan: this.listConversion.length,
          rowspan: this.listConversion.length > 0 ? 1 : 2,
          child: this.getHeader(),
          width: 500
        },
        {
          title: 'kpi.indicators.table.significance',
          fieldType: 'tdTemplate',
          rowspan: 2,
          fieldTypeValue: this.significanceTpl,
          width: 150
        },
        {
          title: 'kpi.indicators.table.measurement',
          fieldType: 'tdTemplate',
          rowspan: 2,
          fieldTypeValue: this.measurementTpl,
          width: 150
        },
        {
          title: 'kpi.indicators.table.systemInfo',
          fieldType: 'tdTemplate',
          rowspan: 2,
          fieldTypeValue: this.systemInfoTpl,
          width: 150
        },
        {
          title: 'kpi.indicatorConversions.table.note',
          field: 'note',
          rowspan: 2,
          width: 200
        }
      ],
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1,
      showSelect: true,
      key: 'indicatorConversionId'
    };
  }

  getHeader() {
    const listHeader: HBTTableHeader[] = [];
    this.listConversion.forEach((column: any) => {
      const header: HBTTableHeader = {
        title: column.name,
        field: column.value,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      };
      listHeader.push(header);
    });
    return listHeader;
  }


  search(page?: number, data?: any, dataEmp?: any) {
    if (!data && !dataEmp) {
      this.isSubmitted = true;
      if (this.form.invalid) {
        return;
      }
    }
    const params = this.form.value;
    this.params = {
      ...params,
      isEmp: this.isEmp,
      listId: data ?? [],
      listEmpId: dataEmp ?? []
    };
    this.pagination.pageNumber = page ?? 1;
    this.conversionService.getFilterResearch(this.params, this.pagination.getCurrentPage(), UrlConstant.INDICATOR_CONVERSION.SEARCH_POPUP).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        res.data.listData.forEach((item) => {
          item.conversions.forEach((conversion) => {
            item[conversion.resultId] = conversion.expression;
          });
          const exists = this.listData.some(it => it.indicatorConversionId === item.indicatorConversionId);
          if (!exists) {
            this.listData.push(item);
          }
        });
        this.tableData = res.data.listData;
        this.tableConfig.total = res.data.total;
        this.tableConfig.pageIndex = res.data.pageIndex;
      }
    });
  }

  strReplaceSpace(str: any) {
    return str.replace(/\s/g, ' ');
  }

  selectValue() {
    if (!this.listId || this.listId.length == 0) {
      this.toast.error(this.translate.instant('kpi.validates.indicatorSelect'));
      return;
    }
    const idsDelete = this.data.filter(it => !this.listId.includes(it));
    const result = this.listData.filter(item => !this.data.includes(item.indicatorConversionId));
    const data = result.filter(it => this.listId.includes(it.indicatorConversionId));
    this.modalRef?.close({ data: data, idsDelete: idsDelete });
  }


}
