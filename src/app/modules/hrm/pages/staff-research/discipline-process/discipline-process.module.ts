import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpsIndexComponent } from './dps-index/dps-index.component';
import { DisciplineProcessRoutingModule } from './discipline-process.routing.module';
import { HrmModule } from '@app/modules/hrm/hrm.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { DpsFormComponent } from '@app/modules/hrm/pages/staff-research/discipline-process/dps-form/dps-form.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    DpsIndexComponent,
    DpsFormComponent
  ],
  imports: [
    CommonModule,
    DisciplineProcessRoutingModule,
    HrmModule,
    StaffResearchCommonModule,
    SharedModule
  ]
})
export class DisciplineProcessModule { }
