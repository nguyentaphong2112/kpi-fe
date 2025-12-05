import {Component, Injector, Input, OnInit} from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { FormArray, Validators } from '@angular/forms';
import { HBTTableConfig, HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { Pagination } from '@shared/model/pagination';
import {
  OrganizationEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/organization-evaluations.service';
import { CategoriesService } from '@app/modules/admin/data-access/services/categories/categories.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-view-org-parent',
  templateUrl: './view-org-parent.component.html',
  styleUrls: ['./view-org-parent.component.scss']
})
export class ViewOrgParentComponent extends BaseFormComponent<NzSafeAny> implements OnInit {

  @Input() data: any;
  @Input() mode: any;

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
  listTarget = [];
  tableData: any[] = [];
  listOrg = [];
  pagination = new Pagination();


  constructor(
    injector: Injector,
    private categoryService: CategoriesService,
    private service: OrganizationEvaluationsService) {
    super(injector);
    this.initDataSelect();
  }

  ngOnInit(): void {
    this.initFormSearch();
    this.getListOrgData();
  }

  initFormSearch() {
    this.form = this.fb.group({
      orgParentId: [null, Validators.required],
      evaluationPeriodId: [this.data.evaluationPeriodId]
    });
    this.f.orgParentId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
      if (value) {
        setTimeout(() => {
          this.search(1);
        });
      }
    });

  }

  getListOrgData() {
    const params = { orgId: this.data.orgId, employeeId: this.data.empManagerId };
    this.service.getList(params, UrlConstant.ORGANIZATION_EVALUATION.ORG_PARENT + '/' + this.data.evaluationPeriodId).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listOrg = res.data;
        if (res.data.length > 0) {
          this.f['orgParentId'].setValue(this.listOrg[0].organizationId);
        }
      }
    });
  }

  search(page?: number) {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const params = this.form.value;
    this.pagination.pageNumber = page ?? 1;
    this.service.getFilterResearch(params, this.pagination.getCurrentPage(), UrlConstant.ORGANIZATION_EVALUATION.ORG_PARENT).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        res.data.listData.forEach(it => {
          // while (typeof it.target === "string") {
          //   it.target = JSON.parse(it.target);
          // }
          // const target = it.target;
          const target = JSON.parse(it.target);
          this.listTarget.forEach((item: any) => {
            it[item.value] = target[item.code.toLowerCase()];
          });
        });
        this.tableData = res.data.listData;
        this.tableConfig.total = res.data.total;
        this.tableConfig.pageIndex = res.data.pageIndex;
      }
    });
  }

  initDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_DKY_MUC_TIEU_DON_VI)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listTarget = res.data;
        this.setHeaders();
      }
    });
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
          title: 'kpi.kpiEvaluations.organizations.table.name',
          field: 'indicatorName',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 250,
          rowspan: 2
        },
        {
          title: 'kpi.kpiEvaluations.organizations.table.weight',
          field: 'percent',
          tdClassList: ['text-right'],
          rowspan: 2,
          width: 70
        },
        {
          title: 'kpi.kpiEvaluations.organizations.table.target',
          field: 'unitName',
          colspan: 3,
          width: 300,
          child: this.getHeader()
        },
        {
          title: 'kpi.kpiEvaluations.organizations.table.leaderName',
          field: 'leaderName',
          rowspan: 2,
          width: 300
        },
        {
          title: 'kpi.kpiEvaluations.organizations.table.collaboratorName',
          field: 'collaboratorName',
          rowspan: 2,
          width: 300
        }
      ],
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1
    };
  }

  getHeader() {
    const listHeader: HBTTableHeader[] = [];
    this.listTarget.forEach((column: any) => {
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

}
