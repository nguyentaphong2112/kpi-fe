import { Component, Injector, OnInit } from '@angular/core';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { ErsFormComponent } from '@app/modules/hrm/pages/staff-research/evaluation-results/ers-form/ers-form.component';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Validators } from '@angular/forms';
import { CategoryModel } from '@core/models/category-common.interface';
import { distinctUntilChanged } from 'rxjs';
import { Utils } from '@core/utils/utils';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-ers-index',
  templateUrl: './ers-index.component.html',
  styleUrls: ['./ers-index.component.scss']
})
export class ErsIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  moduleName = Constant.MODULE_NAME.EVALUATION_RESULTS;
  functionCode: string = FunctionCode.HR_EVALUATION_RESULTS;
  urlConstant = UrlConstant;
  fileExportName = 'qua_trinh_danh_gia.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.evaluationResultInfo',
    content: ErsFormComponent
  };
  tableHeaders: HBTTableHeader[] = [
    {
      title: 'STT',
      thClassList: ['text-center'],
      tdClassList: ['text-center'],
      fixedDir: 'left',
      width: 50,
      fixed: window.innerWidth > 1024
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.employeeCode',
      field: 'employeeCode',
      fixed: window.innerWidth > 1024,
      width: 120,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.fullName',
      field: 'fullName', width: 150,
      needEllipsis: true,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.orgName',
      field: 'orgName',
      width: 200
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.empTypeName',
      field: 'empTypeName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.positionName',
      field: 'jobName',
      width: 120
    },
    {
      title: 'hrm.staffManager.evaluationResults.table.year',
      field: 'year',
      width: 100,
      tdClassList: ['text-center'],
      thClassList: ['text-center']
    },
    {
      title: 'hrm.staffManager.evaluationResults.table.evaluationPeriodId',
      field: 'evaluationPeriodName',
      width: 150
    },
    {
      title: 'hrm.staffManager.evaluationResults.table.evaluationType',
      field: 'evaluationTypeName',
      width: 140
    },
    {
      title: 'hrm.staffManager.evaluationResults.table.kpiResult',
      field: 'kpiResult',
      width: 150
    },
    {
      title: 'hrm.staffManager.evaluationResults.table.kpiPoint',
      field: 'kpiPoint',
      width: 120
    },
    {
      title: 'hrm.staffManager.evaluationResults.table.note',
      field: 'note',
      width: 150,
      show: false
    },
    {
      title: 'hrm.staffManager.staffResearch.eduHis.table.flagStatus',
      field: 'empStatusName',
      width: 100,
      show: false
    },
    {
      title: 'common.label.createdBy',
      field: 'createdBy',
      width: 150,
      show: false
    },
    {
      title: 'common.label.createdTime',
      tdClassList: ['text-center'],
      field: 'createdTime',
      width: 120,
      show: false
    },
    {
      title: 'common.label.modifiedBy',
      field: 'modifiedBy',
      width: 150,
      show: false
    },
    {
      title: 'common.label.modifiedTime',
      tdClassList: ['text-center'],
      field: 'modifiedTime',
      width: 120,
      show: false
    }
  ];

  listEvaluationPeriod: CategoryModel[] = [];
  listEvaluationType: CategoryModel[] = [];

  constructor(
    injector: Injector,
    private dataService: DataService
  ) {
    super(injector);
    this.getListEvaluationType();
  }

  ngOnInit() {
    this.initFormImport();
  }

  get f() {
    return this.formImport.controls;
  }

  initFormImport() {
    this.formImport = this.fb.group({
      isForceUpdate: [false, [Validators.required]],
      year: [null, [Validators.required]],
      periodId: [null, [Validators.required]],
      evaluationType: [null, [Validators.required]]
    });

    this.subscriptions.push(
      this.f.year.valueChanges.pipe(distinctUntilChanged()).subscribe(year => {
        if (year && this.f.evaluationType.value) {
          const params = {
            year: Utils.convertDateToSendServer(year, 'yyyy'),
            evaluationType: this.f.evaluationType.value
          };
          this.getListEvaluationPeriod(params);
        } else {
          this.listEvaluationPeriod = [];
          this.f.periodId.reset();
        }
      })
    );

    this.subscriptions.push(
      this.f.evaluationType.valueChanges.pipe(distinctUntilChanged()).subscribe(evaluationType => {
        if (evaluationType && this.f.year.value) {
          const params = {
            year: Utils.convertDateToSendServer(this.f.year.value, 'yyyy'),
            evaluationType: evaluationType
          };
          this.getListEvaluationPeriod(params);
        } else {
          this.listEvaluationPeriod = [];
          this.f.periodId.reset();
        }
      })
    );
  }

  getListEvaluationPeriod(params: any) {
    this.dataService.getDataByParam(this.urlConstant.GET_EVALUATION_PERIODS, params, MICRO_SERVICE.HRM).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listEvaluationPeriod = res.data;
        if (!this.listEvaluationPeriod.some((item: any) => item.evaluationPeriodId === this.f.periodId.value)) {
          this.f.periodId.reset();
        }
      }
    });
  }

  getListEvaluationType() {
    this.subscriptions.push(
      this.dataService.getDataByParam(this.getUrlCategory(this.categoryCode.KPI_LOAI_DANH_GIA), null, MICRO_SERVICE.ADMIN).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listEvaluationType = res.data;
        }
      })
    );
  }

}
