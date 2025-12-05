import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApsIndexComponent } from './aps-index/aps-index.component';
import { AwardProcessRoutingModule } from './award-process.routing.module';
import { SharedModule } from '@shared/shared.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { ApsFormComponent } from '@app/modules/hrm/pages/staff-research/award-process/aps-form/aps-form.component';

@NgModule({
  declarations: [
    ApsIndexComponent,
    ApsFormComponent
  ],
    imports: [
        CommonModule,
        AwardProcessRoutingModule,
        SharedModule,
        StaffResearchCommonModule
    ]
})
export class AwardProcessModule { }
