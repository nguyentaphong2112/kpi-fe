import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DutyScheduleMonthRoutingModule } from './duty-schedule-month-routing.module';
import { DsmIndexComponent } from './dsm-index/dsm-index.component';
import { DsmFormComponent } from './dsm-form/dsm-form.component';
import { CoreModule } from '@core/core.module';
import { DutySchedulesModule } from '@app/modules/abs/pages/duty-schedule-manager/duty-schedules/duty-schedules.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    DsmIndexComponent,
    DsmFormComponent
  ],
  imports: [
    CommonModule,
    DutyScheduleMonthRoutingModule,
    CoreModule,
    DutySchedulesModule,
    NzDropDownModule,
    NzFormModule,
    NzGridModule,
    NzIconModule,
    NzMenuModule,
    NzModalModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ]
})
export class DutyScheduleMonthModule {
}
