import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpnIndexComponent } from './epn-index/epn-index.component';
import { EpnFormComponent } from './epn-form/epn-form.component';
import { EducationPromotionRoutingModule } from '@app/modules/hrm/pages/staff-research/education-promotion/education-promotion.routing.module';
import { StaffResearchCommonModule } from '@app/modules/hrm/pages/staff-research/staff-research-common/staff-research-common.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    EpnIndexComponent,
    EpnFormComponent
  ],
  imports: [
    CommonModule,
    EducationPromotionRoutingModule,
    StaffResearchCommonModule,
    SharedModule
  ]
})
export class EducationPromotionModule { }
