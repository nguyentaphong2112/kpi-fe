import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { PersonalIdentityRoutingModule } from './personal-identity.routing.module';
import { PiyIndexComponent } from '@app/modules/hrm/pages/staff-research/personal-identity/piy-index/piy-index.component';
import { PiyFormComponent } from '@app/modules/hrm/pages/staff-research/personal-identity/piy-form/piy-form.component';

@NgModule({
  declarations: [
    PiyIndexComponent,
    PiyFormComponent
  ],
  imports: [
    CommonModule,
    PersonalIdentityRoutingModule,
    SharedModule,
    StaffResearchCommonModule
  ]
})
export class PersonalIdentityModule { }
