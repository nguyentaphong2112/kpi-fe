import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseListComponent} from '@core/components/base-list.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {UrlConstant as UrlConstantShare} from '@shared/constant/url.class';
import {CommonUtils} from '@shared/services/common-utils.service';
import {DateValidator} from '@shared/custom-validator/dateValidator.class';
import {MatReportService} from '@app/modules/mat/data-access/services/report/mat-report.service';
import {Validators} from "@angular/forms";
import {Constant} from "@app/modules/mat/data-access/constants/constants";
import {Scopes} from "@core/utils/common-constants";

@Component({
  selector: 'app-mrt-index',
  templateUrl: './mrt-index.component.html',
  styleUrls: ['./mrt-index.component.scss']
})

export class MrtIndexComponent extends BaseListComponent<any> implements OnInit {
  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/mat-transferring-shipments';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  functionCode = Constant.FUNCTION_CODE.MAT_REPORT;
  scope = Scopes.EDIT;

  constructor(
    injector: Injector,
    private readonly service: MatReportService
  ) {
    super(injector);
    this.initFormSearch();
    this.isCustomSearch = true;
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true),  '/' + this.form.controls['type'].value?.toLowerCase());
  }

  initFormSearch() {
    this.form = this.fb.group({
      type: [null, [Validators.required]],
      departmentId: [null],
      warehouseId: [null],
      equipmentTypeId: [null],
      equipmentId: [null],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
    }, {
      validators:
        [DateValidator.validateRangeDate('fromDate', 'toDate', 'rangeDateError')]
    });
  }

  override beforeExport() {
  }

  changeReportType() {
    switch (this.form.controls['type'].value) {
      case 'EQUIPMENT-STOCK-REPORT':
        this.setValidate(['equipmentTypeId', 'equipmentId'], true);
        this.setValidate(['warehouseId']);
        break;
      case 'EQUIPMENT-TYPE-STOCK-REPORT':
        this.setValidate(['equipmentTypeId', 'equipmentId'], true);
        this.setValidate(['warehouseId']);
        break;
      case 'EQUIPMENT-DEPARTMENT-STOCK-REPORT':
        this.setValidate(['warehouseId', 'equipmentTypeId', 'equipmentId'], true);
        break;
      case 'EQUIPMENT-DETAIL-STOCK-REPORT':
        this.setValidate(['warehouseId', 'equipmentTypeId', 'equipmentId']);
        break;
    }
  }

  setValidate(arrFormControlName: string[], isClear?: boolean) {
    for (const controlName of arrFormControlName) {
      if (this.form.controls[controlName]) {
        if (isClear) {
          this.form.controls[controlName].clearValidators();
          this.form.controls[controlName].setErrors(null);
          this.form.controls[controlName].setValue(null);
        } else {
          this.form.controls[controlName].setValidators([Validators.required]);
        }
        this.form.controls[controlName].updateValueAndValidity();
      }
    }
  }
}

