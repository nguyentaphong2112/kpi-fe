import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  InsuranceContributionsService
} from '@app/modules/icn/data-access/services/caculate/insurance-contributions.service';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { BaseResponse } from '@core/models/base-response';
import { Pagination } from '@shared/model/pagination';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { HBTTableConfig } from '@shared/component/hbt-table/hbt-table.interfaces';
import { TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import {
  InsuranceRetractionsService
} from '@app/modules/icn/data-access/services/caculate/insurance-retractions.service';
import _ from 'lodash';
import { format } from 'date-fns';

@Component({
  selector: 'app-arrears-pre-period-view',
  templateUrl: './arrears-pre-period-view.component.html',
  styleUrls: ['./arrears-pre-period-view.component.scss']
})
export class ArrearsPrePeriodViewComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  pagination = new Pagination();
  tableData: NzSafeAny[] = [];
  tableConfig: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    showSelect: true,
    key: 'insuranceRetractionId',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };
  selectionIds = [];

  constructor(
    injector: Injector,
    private readonly service: InsuranceRetractionsService,
    private readonly insuranceService: InsuranceContributionsService
  ) {
    super(injector);
    this.key = 'insuranceContributionId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.setHeader();
    this.search();
  }

  override initForm() {
    this.form = this.fb.group({
      keySearch: [null],
      listType: [null],
      fromPeriodDate: [null],
      toPeriodDate: [null]
    }, {
      validators:
        [DateValidator.validateRangeDate('fromPeriodDate', 'toPeriodDate', 'rangeDateError')]
    });
  }

  onSelectAll() {
    this.isSubmitted = true;
    if (this.form.valid) {
      let data = this.form.value;
      data.periodDate = this.data.periodDate;
      this.insuranceService.postParams(data, '/retro-all')
        .subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toast.success(this.translate.instant('common.notification.updateSuccess'));
            this.modalRef?.close({ refresh: true });
          }
        });
    }
  }

  onSelect() {
    this.isSubmitted = true;
    if (this.form.valid) {
      let data = { periodDate: this.data.periodDate, ids: this.selectionIds.join(',') };
      this.insuranceService.postParams(data, '/retro')
        .subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toast.success(this.translate.instant('common.notification.updateSuccess'));
            this.modalRef?.close({ refresh: true });
          }
        });
    }
  }

  setHeader() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 50,
        rowspan: 2
      },

      {
        title: 'icn.icnContribution.calculate.model.employeeCode',
        field: 'employeeCode',
        width: 100,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'icn.icnContribution.calculate.model.fullName',
        field: 'fullName',
        rowspan: 2,
        width: 200,
        thClassList: ['text-center']
      },
      {
        title: 'icn.icnContribution.calculate.model.retroPeriodDate',
        field: 'periodDate',
        rowspan: 2,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 200
      },
      {
        title: 'icn.icnContribution.calculate.model.totalSalaryContributions',
        colspan: 5,
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.icnContribution.calculate.model.contractSalary',
            field: 'contractSalary',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 140
          },
          {
            title: 'icn.icnContribution.calculate.model.reserveSalary',
            field: 'reserveSalary',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 200
          },
          {
            title: 'icn.icnContribution.calculate.model.posAllowanceSalary',
            field: 'posAllowanceSalary',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 170
          },
          {
            title: 'icn.icnContribution.calculate.model.senioritySalary',
            field: 'senioritySalary',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 200
          },
          {
            title: 'icn.icnContribution.calculate.model.posSenioritySalary',
            field: 'posSenioritySalary',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 180
          }
        ]
      },
      {
        title: 'icn.icnContribution.calculate.model.social',
        colspan: 2,
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.icnContribution.calculate.model.perSocialAmount',
            field: 'perSocialAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          },
          {
            title: 'icn.icnContribution.calculate.model.unitSocialAmount',
            field: 'unitSocialAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          }
        ]
      },
      {
        title: 'icn.icnContribution.calculate.model.medical',
        colspan: 2,
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.icnContribution.calculate.model.perMedicalAmount',
            field: 'perMedicalAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          },
          {
            title: 'icn.icnContribution.calculate.model.unitMedicalAmount',
            field: 'unitMedicalAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          }
        ]
      },
      {
        title: 'icn.icnContribution.calculate.model.unemp',
        colspan: 2,
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.icnContribution.calculate.model.perUnempAmount',
            field: 'perUnempAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          },
          {
            title: 'icn.icnContribution.calculate.model.unitUnempAmount',
            field: 'unitUnempAmount',
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            width: 110
          }
        ]
      },
      {
        title: 'icn.icnContribution.calculate.model.totalAmount',
        field: 'totalAmount',
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        tdClassList: ['text-right'],
        rowspan: 2,
        width: 130
      },
      {
        title: 'icn.icnContribution.calculate.model.empTypeCode',
        field: 'empTypeName',
        rowspan: 2,
        width: 175
      },
      {
        title: 'icn.icnContribution.calculate.model.jobName',
        field: 'jobName',
        rowspan: 2,
        width: 200
      },
      {
        title: 'icn.icnContribution.calculate.model.orgName',
        field: 'orgName',
        rowspan: 2,
        width: 200
      }
    ];
  }


  search(page?: number) {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    let params = _.clone(this.form.value);
    this.pagination.pageNumber = page ?? 1;
    this.service.getFilterResearch({
      ...params,
      fromPeriodDate: this.form.controls['fromPeriodDate'].value ? format(this.form.controls['fromPeriodDate'].value, 'dd/MM/yyyy') : null,
      toPeriodDate: this.form.controls['toPeriodDate'].value ? format(this.form.controls['toPeriodDate'].value, 'dd/MM/yyyy') : null
    }, this.pagination.getCurrentPage(), '/retro')
      .subscribe(
        (res: BaseResponse<any>) => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            if (res.code === HTTP_STATUS_CODE.SUCCESS) {
              this.tableData = res.data.listData;
              this.tableConfig.total = res.data.total;
              this.tableConfig.pageIndex = res.data.pageIndex;
            }
          }
        }
      );
  }

}
