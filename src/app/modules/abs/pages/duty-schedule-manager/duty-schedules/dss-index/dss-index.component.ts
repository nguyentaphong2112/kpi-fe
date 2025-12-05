import { Component, Injector, OnInit } from '@angular/core';
import { DutySchedulesModel } from '../../../../data-access/models/duty-schedule-manager/duty-schedules.model';
import { DutySchedulesService } from '../../../../data-access/services/duty-schedule-manager/duty-schedules.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { UrlConstant } from '@app/modules/abs/data-access/constant/url.class';
import { Scopes } from '@core/utils/common-constants';
import { FormGroup, Validators } from '@angular/forms';
import {
  ConfigParameterService
} from '@app/modules/admin/data-access/services/configurations/config-parameter.service';
import { FunctionCode } from '@shared/enums/enums-constant';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { BaseResponse } from '@core/models/base-response';

@Component({
  selector: 'app-dss-index',
  templateUrl: './dss-index.component.html',
  styleUrls: ['./dss-index.component.scss']
})


export class DssIndexComponent extends BaseListComponent<DutySchedulesModel> implements OnInit {
  urlLoadData = UrlConstant.DUTY_SCHEDULES.LIST_WEEKS;
  scope = Scopes.VIEW;
  weekList = [];
  functionCode = FunctionCode.ABS_DUTY_SCHEDULES;
  isVisible = false;
  isSubmittedModal = false;
  formModal!: FormGroup;
  dateValue = null;
  responseSearch: any;

  constructor(
    injector: Injector,
    private configParameterService: ConfigParameterService,
    private readonly service: DutySchedulesService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.key = 'resourceId';
    this.isCustomSearch = true;
  }

  ngOnInit() {
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.getListData();
  }

  async search(index?: number) {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.pagination.pageNumber = index ?? 1;
    const data = {
      organizationId: this.form.controls.organizationId.value,
      dateValue: this.form.controls.dateValue.value
    };
    this.searchApi(data, this.pagination.getCurrentPage())
      .subscribe(
        (res: BaseResponse<any>) => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.responseSearch = res.data;
            this.isSubmitted = false;
          }
        }
      );
  }

  getListData() {
    this.service.getList(null, this.urlLoadData).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.weekList = res.data;
        this.form.controls.dateValue.setValue(this.weekList[0].value);
      }
    });
  };

  handleCancel(): void {
    this.isVisible = false;
    this.isSubmittedModal = false;
    this.formModal.controls.fromDate.setValue(null);
    this.formModal.controls.toDate.setValue(null);
  }

  export() {
    this.isSubmitted = true;
    if (this.isVisible) {
      this.isSubmittedModal = true;
      if (this.formModal.invalid) {
        return;
      }
    }
    const params = this.formModal.value;
    this.params = {
      ...params
    };
    this.beforeExport();
    this.exportApi(this.params).toPromise();
  }

  exportTotal(){
    const params = this.form.value;
    const selectedDateValue = params.dateValue;
    const selectedWeek = this.weekList.find(week => week.value === selectedDateValue);
    const [fromDate, toDate] = selectedWeek.name.split(' - ').map(date => date.trim());
    this.params = {
      fromDate,
      toDate
    };
    this.service.exportTotal(this.params).toPromise();
  }

  changeValue($event) {
    if ($event != this.dateValue) {
      this.dateValue = $event;
      this.search();
    }
  }

  initFormSearch() {
    this.form = this.fb.group({
      dateValue: [null, Validators.required],
      organizationId: [1, Validators.required]
    });

    this.formModal = this.fb.group({
      organizationId: [this.form.get('organizationId').value ?? null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    }, {
      validators:
        [DateValidator.validateRangeDate('fromDate', 'toDate', 'rangeDateError')]
    });
  }

}

