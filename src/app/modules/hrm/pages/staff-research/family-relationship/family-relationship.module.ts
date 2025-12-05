import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrpIndexComponent } from './frp-index/frp-index.component';
import { SharedModule } from '@shared/shared.module';
import { FamilyRelationshipRoutingModule } from './family-relationship.routing.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { FrpFormComponent } from '@app/modules/hrm/pages/staff-research/family-relationship/frp-form/frp-form.component';

@NgModule({
  declarations: [
    FrpIndexComponent,
    FrpFormComponent
  ],
    imports: [
        CommonModule,
        FamilyRelationshipRoutingModule,
        SharedModule,
        StaffResearchCommonModule
    ]
})
export class FamilyRelationshipModule { }
