import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { IndicatorsModel } from '@app/modules/kpi/data-access/models/kpi-managers/indicators.model';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import {
  EmployeeEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/employee-evaluations.service';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { CategoriesService } from '@app/modules/admin/data-access/services/categories/categories.service';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { BaseResponse } from '@core/models/base-response';

@Component({
  selector: 'app-list-evaluation',
  templateUrl: './list-evaluation.component.html',
  styleUrls: ['./list-evaluation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListEvaluationComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  nzWidthConfig = ['250px', '70px', '200px'];
  listAllData = null;
  listConversion = [];
  dataValues: Map<string, any> = new Map<string, any>();
  functionCode = Constant.FUNCTION_CODE.EMPLOYEE_EVALUATE;

  constructor(
    private readonly service: EmployeeEvaluationsService,
    private categoryService: CategoriesService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.isNotPageName = true;
    this.initDataSelect();
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: IndicatorsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, '/save-list-evaluate');
    this.updateApi = (body: IndicatorsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
  }

  ngOnInit(): void {
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.getInitData();
  }

  initDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_THANG_DO)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listConversion = res.data;
      }
    });
  }

  getInitData() {
    const listId = this.route.snapshot.queryParams.listId;
    this.service.getList({ listId: listId }, '/indicator-list').subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listAllData = res.data;
        this.listAllData?.listEmp?.forEach(it => {
          this.nzWidthConfig.push('200px', '70px', '200px', '70px');
        });
        this.listConversion?.forEach(it => {
          this.nzWidthConfig.push('100px');
        });
        this.nzWidthConfig.push('100px');
        this.patchValue();
      }
    });
  }

  checkIsEvaluate(data: NzSafeAny) {
    return (data.status === Constant.STATUS.PHE_DUYET || data.status === Constant.STATUS.DANH_GIA) && this.objFunction.edit;
  }

  checkIsEvaluateManage(data: NzSafeAny) {
    return (data.status === Constant.STATUS.DANH_GIA || data.status === Constant.STATUS.QLTT_DANH_GIA) && this.objFunction.approve;
  }


  patchValue() {
    for (let i = 0; i < this.listAllData?.listData.length; i++) {
      let dataParent = this.listAllData?.listData[i];
      dataParent.isSelected = dataParent.ratingType == 'SELECT';
      dataParent.dataSelect = dataParent?.listValues?.split(';').map(it => ({
        label: it,
        value: it
      })) || [];
      for (let j = 0; j < dataParent.listEmp.length; j++) {
        let data = dataParent.listEmp[j];
        this.dataValues.set(data.employeeIndicatorId,
          {
            'employeeIndicatorId': data.employeeIndicatorId,
            'employeeId': data.employeeId,
            'result': data.result,
            'resultManage': data.resultManage,
            'selfPoint': data.selfPoint,
            'managePoint': data.managePoint,
            'status': data.status,
            'employeeEvaluationId': data.employeeEvaluationId,
            'percent': dataParent.percent
          }
        );
      }
    }
    this.ref.detectChanges();
  }

  updateResultManage(resultValue: NzSafeAny, data: NzSafeAny, name: string, emp: NzSafeAny) {
    const empInfo = this.checkExistEmp(data.listEmp, emp);
    if (!empInfo) return;
    if (resultValue == null || resultValue == '') {
      this.dataValues.get(empInfo.employeeIndicatorId)[name] = null;
    }

    const resultValueFloat = parseFloat(resultValue);

    const validPoints: number[] = [];
    const isFocusReduction = data.isFocusReduction;

    this.listConversion.forEach((conversion: any) => {
      const value = this.getConversion(data.conversions, conversion.value);
      if (value) {
        const conditions = data.isSelected ? [value] : value.split(' và ');
        let allValid = true;
        conditions.forEach((condition: string) => {
          let match;
          if (data.isSelected) {
            match = condition.match(/=\s*(.+)/);
          } else {
            match = condition.match(/(>= |<= |> |< |= )\s*(\d+(\.\d+)?)/);
          }
          if (match) {
            if (data.isSelected) {
              const text = match[1].trim();
              allValid = resultValue.toLowerCase().trim() == text.toLowerCase();
            } else {
              const operator = match[1];
              const num = parseFloat(match[2]);
              if (num != null && !isNaN(num)) {
                let isValid = false;
                switch (operator) {
                  case '> ':
                    isValid = resultValueFloat > num;
                    break;
                  case '< ':
                    isValid = resultValueFloat < num;
                    break;
                  case '>= ':
                    isValid = resultValueFloat >= num;
                    break;
                  case '<= ':
                    isValid = resultValueFloat <= num;
                    break;
                  case '= ':
                    isValid = resultValueFloat == num;
                    break;
                }

                if (!isValid) {
                  allValid = false;
                }
              } else {
                allValid = false;
              }
            }
          } else {
            if (data.isSelected) {
              const text = condition.trim();
              allValid = resultValue.toLowerCase().trim() == text.toLowerCase();
            } else {
              const num = parseFloat(condition.trim());
              allValid = resultValueFloat == num;
            }
          }
        });
        if (allValid) {
          validPoints.push(conversion.value);
        }
      }
    });

    let finalScore = null;
    if (validPoints.length > 0) {
      finalScore = isFocusReduction === 'N' ? Math.max(...validPoints) : Math.min(...validPoints);
    }

    this.dataValues.get(empInfo.employeeIndicatorId)[name] = finalScore;
  }


  private calculateTotalPoint(emp: any, pointField: 'selfPoint' | 'managePoint'): number {
    const totalPoint = this.listAllData?.listData.reduce((sum: number, item: NzSafeAny) => {
      const empExist = this.checkExistEmp(item.listEmp, emp);
      if (!empExist) return sum;

      const empData = this.dataValues.get(empExist.employeeIndicatorId);
      const point = parseFloat(String(empData?.[pointField] ?? 0));
      const percent = parseFloat(String(item.percent ?? 0)) / 100;

      return sum + (point * percent || 0);
    }, 0) || 0;

    return Number(totalPoint.toFixed(2));
  }

  getTotalSelfPoint(emp: any): number {
    return this.calculateTotalPoint(emp, 'selfPoint');
  }

  getTotalManagePoint(emp: any): number {
    return this.calculateTotalPoint(emp, 'managePoint');
  }

  getValueSelect(data: any, value: any, keyValue = 'value', keyLabel = 'label') {
    return data.find(it => it[keyValue] == value) ? data.find(it => it[keyValue] == value)[keyLabel] : '-';
  }

  checkExistEmp(empData: NzSafeAny, empAll: NzSafeAny) {
    return empData.find(it => it.employeeId == empAll.employeeId);
  }

  getConversion(data: NzSafeAny, value: NzSafeAny) {
    let result = data.find(it => it.resultId == value)?.expression;
    return result ?? '';
  }

  save() {
    this.isSubmitted = true;
    if (this.validateDataValues()) {
      if (!this.body) {
        this.body = {};
      }
      this.body.listData = [...this.dataValues.values()];
      this.body.listSum = this.calculateTotalsByEvaluationId(this.body.listData);
      this.createApi(this.body)
        .subscribe(
          (res: BaseResponse<any>) => {
            if (res.code === HTTP_STATUS_CODE.SUCCESS) {
              this.toast.success(
                this.translate.instant('common.notification.updateSuccess')
              );
              this.back();
            }
          }
        );
    }
  }

  private calculateTotalsByEvaluationId(listData: NzSafeAny) {
    const totals = new Map<number, { totalSelfPoint: number; totalManagePoint: number }>();

    for (const data of listData) {
      const evalId = data.employeeEvaluationId;
      const current = totals.get(evalId) || { totalSelfPoint: 0, totalManagePoint: 0 };

      const percent = parseFloat(String(data.percent ?? 0)) / 100;

      const selfPoint = parseFloat(String(data.selfPoint ?? 0));
      const managePoint = parseFloat(String(data.managePoint ?? 0));
      current.totalSelfPoint += selfPoint * percent;
      current.totalManagePoint += managePoint * percent;

      totals.set(evalId, current);
    }

    return Array.from(totals, ([employeeEvaluationId, total]) => ({
      employeeEvaluationId,
      totalSelfPoint: Number(total.totalSelfPoint.toFixed(2)),
      totalManagePoint: Number(total.totalManagePoint.toFixed(2))
    }));

  }

  private validateDataValues(): boolean {
    for (const data of this.listAllData?.listData || []) {
      for (const emp of data.listEmp || []) {
        const empExist = this.checkExistEmp(data.listEmp, emp);
        if (empExist) {
          const empData = this.dataValues.get(empExist.employeeIndicatorId);

          if (this.checkIsEvaluate(empData) && !this.isValidValue(empData?.result)) {
            return false;
          }

          if (this.checkIsEvaluateManage(empData) && !this.isValidValue(empData?.resultManage)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private isValidValue(value: string | number | undefined): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return true;
  }

}
