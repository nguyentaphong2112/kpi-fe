import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { CheckExtraMode } from '@app/modules/hrm/data-access/pipes/check-extra-mode.pipe';
import { CheckPanelPermission } from '@app/modules/hrm/data-access/pipes/check-panel-permission.pipe';
import { StaffInfoRoutingModule } from '@app/modules/hrm/pages/staff-info/staff-info.routing.module';
import { StaffResearchCommonModule } from '@app/modules/hrm/pages/staff-research/staff-research-common/staff-research-common.module';
import { PersonalInformationModule } from '@app/modules/hrm/pages/staff-info/personal-information/personal-information.module';
import { HeaderInfoModule } from '@app/modules/hrm/pages/staff-info/header-info/header-info.module';
import { EducationInformationModule } from '@app/modules/hrm/pages/staff-info/education-information/education-information.module';
import { AwardInformationModule } from '@app/modules/hrm/pages/staff-info/award-information/award-information.module';
import { FamilyRelationshipsModule } from '@app/modules/hrm/pages/staff-info/family-relationships/family-relationships.module';
import { WorkInformationModule } from '@app/modules/hrm/pages/staff-info/work-information/work-information.module';
import { PolicyInfoModule } from '@app/modules/hrm/pages/staff-info/policy-info/policy-info.module';

@NgModule({
  declarations: [
    CheckExtraMode,
    CheckPanelPermission
  ],
  exports: [
    CheckExtraMode,
    CheckPanelPermission
  ],
  imports: [
    CommonModule,
    StaffInfoRoutingModule,
    PersonalInformationModule,
    SharedModule,
    StaffResearchCommonModule,
    HeaderInfoModule,
    EducationInformationModule,
    AwardInformationModule,
    FamilyRelationshipsModule,
    WorkInformationModule,
    PolicyInfoModule
  ]
})
export class StaffInfoModule {
}
