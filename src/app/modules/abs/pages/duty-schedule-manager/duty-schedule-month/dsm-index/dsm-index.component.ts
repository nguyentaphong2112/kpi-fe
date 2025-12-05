import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { DutySchedulesModel } from '@app/modules/abs/data-access/models/duty-schedule-manager/duty-schedules.model';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Validators } from '@angular/forms';
import { Scopes } from '@core/utils/common-constants';
import { BaseResponse } from '@core/models/base-response';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import * as _ from 'lodash';
import {
  DutyScheduleMonthService
} from '@app/modules/abs/data-access/services/duty-schedule-manager/duty-schedule-month.service';

@Component({
  selector: 'app-dsm-index',
  templateUrl: './dsm-index.component.html',
  styleUrls: ['./dsm-index.component.scss']
})
export class DsmIndexComponent extends BaseListComponent<DutySchedulesModel> implements OnInit {
  scope = Scopes.VIEW;
  previousDate = new Date();

  constructor(
    injector: Injector,
    private readonly service: DutyScheduleMonthService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.key = 'resourceId';
    this.isCustomSearch = true;
  }

  async ngOnInit() {

    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    await this.search();

    this.f.monthValue.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const current = value.getTime();
        const previous = this.previousDate?.getTime();
        if (current !== previous) {
          this.previousDate = value;
          this.search();
        }
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  async search(index?: number) {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.pagination.pageNumber = index ?? 1;
    const data = _.clone(this.form.value);
    data.monthValue = new Date(this.form.controls['monthValue'].value.getFullYear(), this.form.controls['monthValue'].value.getMonth(), 1);
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


  initFormSearch() {
    this.form = this.fb.group({
      monthValue: [new Date(), Validators.required],
      organizationId: [1, Validators.required]
    });
  }


}
