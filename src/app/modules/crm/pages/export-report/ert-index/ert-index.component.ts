import {Component, Injector, OnInit} from '@angular/core';
import {BaseListComponent} from "@core/components/base-list.component";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {CategoryModel} from "@core/models/category-common.interface";
import {Scopes} from "@core/utils/common-constants";
import {FunctionCode} from "@shared/enums/enums-constant";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {Validators} from "@angular/forms";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {ObjectUtil} from "@core/utils/object.util";
import {format} from "date-fns";
import {Constant} from "@app/modules/crm/data-access/constants/constants";
import {ExportReportService} from "@app/modules/crm/data-access/services/export-report/export-report.service";

@Component({
  selector: 'app-crm-ert-index',
  templateUrl: './ert-index.component.html',
  styleUrls: ['./ert-index.component.scss']
})
export class ErtIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {

  listReportType: CategoryModel[] = [];
  scope: string = Scopes.VIEW;
  functionCode = FunctionCode.SYS_DYNAMIC_REPORT;
  serviceName = MICRO_SERVICE.CRM;


  constructor(injector: Injector,
              private exportReportService: ExportReportService) {
    super(injector);
    this.exportApi = (params: any) => this.exportReportService.export(params, '/' + this.form.controls.dynamicReportId.value, false);
    this.isCustomSearch = true;
    this.initDataSelect();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      dynamicReportId: [null, Validators.required],
      customerId: [null],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    }, {
      validators: [
        DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')
      ]
    });
  }

  initDataSelect() {
    this.listReportType = ObjectUtil.optionsToList(Constant.LIST_REPORT_TYPE,this.translate);
  }

  beforeExport() {
      const { startDate, endDate, month, dynamicReportId, ...otherParams } = this.params;
      this.params = {
        ...otherParams,
        startDate: startDate ? format(startDate, 'dd/MM/yyyy') : null,
        endDate: endDate ? format(endDate, 'dd/MM/yyyy') : null
      };

  }

}
