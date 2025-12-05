import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllowanceProcessRoutingModule } from './allowance-process.routing.module';
import { SharedModule } from '@shared/shared.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { ApsIndexComponent } from './aps-index/aps-index.component';
import { ApsFormComponent } from '@app/modules/hrm/pages/staff-research/allowance-process/aps-form/aps-form.component';

@NgModule({
  declarations: [
    ApsIndexComponent,
    ApsFormComponent
  ],
    imports: [
        CommonModule,
        AllowanceProcessRoutingModule,
        SharedModule,
        StaffResearchCommonModule
    ]
})
export class AllowanceProcessModule { }
