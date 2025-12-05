import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticipationRoutingModule } from './participation-routing.module';
import { PonIndexComponent } from './pon-index/pon-index.component';
import { PonFormComponent } from './pon-form/pon-form.component';
import {
  StaffResearchCommonModule
} from '@app/modules/hrm/pages/staff-research/staff-research-common/staff-research-common.module';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    PonIndexComponent,
    PonFormComponent
  ],
  imports: [
    CommonModule,
    ParticipationRoutingModule,
    SharedModule,
    StaffResearchCommonModule
  ]
})
export class ParticipationModule { }
