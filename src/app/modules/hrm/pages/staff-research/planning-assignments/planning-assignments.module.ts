import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningAssignmentsRoutingModule } from './planning-assignments-routing.module';
import { PasIndexComponent } from './pas-index/pas-index.component';
import { PasFormComponent } from './pas-form/pas-form.component';
import {
  StaffResearchCommonModule
} from '@app/modules/hrm/pages/staff-research/staff-research-common/staff-research-common.module';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    PasIndexComponent,
    PasFormComponent
  ],
  imports: [
    CommonModule,
    PlanningAssignmentsRoutingModule,
    SharedModule,
    StaffResearchCommonModule
  ]
})
export class PlanningAssignmentsModule {
}
