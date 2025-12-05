import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PersonalInfoRoutingModule } from '@app/modules/hrm/pages/personal-info/personal-info.routing.module';
import { PersonalInformationModule } from '@app/modules/hrm/pages/personal-info/personal-information/personal-information.module';
import { StaffResearchCommonModule } from '@app/modules/hrm/pages/staff-research/staff-research-common/staff-research-common.module';
import { HeaderInfoModule } from '@app/modules/hrm/pages/personal-info/header-info/header-info.module';
import { EducationInformationModule } from '@app/modules/hrm/pages/personal-info/education-information/education-information.module';
import { AwardInformationModule } from '@app/modules/hrm/pages/personal-info/award-information/award-information.module';
import { FamilyRelationshipsModule } from '@app/modules/hrm/pages/personal-info/family-relationships/family-relationships.module';
import { WorkInformationModule } from '@app/modules/hrm/pages/personal-info/work-information/work-information.module';
import { PolicyInfoModule } from '@app/modules/hrm/pages/personal-info/policy-info/policy-info.module';

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    PersonalInfoRoutingModule,
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
export class PersonalInfoModule {
}
