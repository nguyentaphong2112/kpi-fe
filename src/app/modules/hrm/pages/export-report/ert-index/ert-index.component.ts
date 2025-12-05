import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CategoryModel } from '@core/models/category-common.interface';
import { ObjectUtil } from '@core/utils/object.util';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { Scopes } from '@core/utils/common-constants';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { Validators } from '@angular/forms';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { format } from 'date-fns';
import { FunctionCode } from '@shared/enums/enums-constant';
import { EmployeeReportService } from '@app/modules/hrm/data-access/services/employee-report.service';
import { CategoriesService } from '@app/shared/services/categories.service';
import { DataService } from '@app/shared/services/data.service';

@Component({
  selector: 'app-ert-index',
  templateUrl: './ert-index.component.html',
  styleUrls: ['./ert-index.component.scss']
})
export class ErtIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  listReportType: CategoryModel[] = [];
  listTypeReportPeriod: CategoryModel[] = [];
  scope: string = Scopes.VIEW;
  functionCode = FunctionCode.SYS_DYNAMIC_REPORT;
  urlLoadObject = UrlConstant.EMP_TYPES.GET_LIST;
  serviceName = MICRO_SERVICE.HRM;
  periodType: 'MONTH' | 'PERIOD' = 'MONTH';


  constructor(injector: Injector,
              private employeeReportService: EmployeeReportService,
            private dataService: DataService) {
    super(injector);
    this.exportApi = (params: any) => this.employeeReportService.export(params, '/' + this.form.controls.dynamicReportId.value, false);
    this.isCustomSearch = true;
    this.initDataSelect();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      dynamicReportId: [null, Validators.required],
      organizationId: null,
      empTypeIds: null,
      typeReportPeriod: ['MONTH', Validators.required],
      startDate: null,
      endDate: null,
      month: null
    }, {
      validators: [
        DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')
      ]
    });
    this.updateValidators();
  }

  initDataSelect() {    
    const url = this.getUrlCategory(this.categoryCode.HR_REPORT_TYPES);
    this.dataService.getData(url, MICRO_SERVICE.ADMIN, true).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        if(res.data.length > 0){
           this.listReportType = res.data.map(item => ({
            ...item,
            label: item.name
          }));
        } else {
          this.listReportType = ObjectUtil.optionsToList(Constant.LIST_REPORT_TYPE, this.translate);
        }
      }
    });
    this.listTypeReportPeriod = ObjectUtil.optionsToList(Constant.LIST_REPORT_PERIOD, this.translate);
  }

  periodChange($event: any) {
    this.isSubmitted = false;
    this.periodType = $event;
    this.updateValidators();
  }


  updateValidators() {
    if (this.periodType === 'MONTH') {
      this.form.get('month')?.setValidators([Validators.required]);
      this.form.get('startDate')?.clearValidators();
      this.form.get('endDate')?.clearValidators();
    } else {
      this.form.get('month')?.clearValidators();
      this.form.get('startDate')?.setValidators([Validators.required]);
      this.form.get('endDate')?.setValidators([Validators.required]);
    }
    this.form.get('month')?.updateValueAndValidity();
    this.form.get('startDate')?.updateValueAndValidity();
    this.form.get('endDate')?.updateValueAndValidity();
  }

  beforeExport() {
    if (this.periodType === 'MONTH') {
      const { startDate, endDate, month, dynamicReportId, ...otherParams } = this.params;
      this.params = {
        ...otherParams,
        month: month ? format(month, 'MM/yyyy') : null
      };
    } else {
      const { startDate, endDate, month, dynamicReportId, ...otherParams } = this.params;
      this.params = {
        ...otherParams,
        startDate: startDate ? format(startDate, 'dd/MM/yyyy') : null,
        endDate: endDate ? format(endDate, 'dd/MM/yyyy') : null
      };
    }
  }

}
