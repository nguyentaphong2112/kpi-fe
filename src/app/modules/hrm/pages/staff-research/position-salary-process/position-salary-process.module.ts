import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PspIndexComponent } from './psp-index/psp-index.component';
import { PspFormComponent } from './psp-form/psp-form.component';
import { PositionSalaryProcessRoutingModule } from '@app/modules/hrm/pages/staff-research/position-salary-process/position-salary-process.routing.module';
import { SharedModule } from '@shared/shared.module';
import { StaffResearchCommonModule } from '@app/modules/hrm/pages/staff-research/staff-research-common/staff-research-common.module';

@NgModule({
  declarations: [
    PspIndexComponent,
    PspFormComponent
  ],
  imports: [
    CommonModule,
    PositionSalaryProcessRoutingModule,
    SharedModule,
    StaffResearchCommonModule
  ]
})
export class PositionSalaryProcessModule { }
