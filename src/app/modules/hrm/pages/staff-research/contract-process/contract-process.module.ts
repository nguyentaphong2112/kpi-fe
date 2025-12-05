import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractProcessRoutingModule } from './contract-process.routing.module';
import { SharedModule } from '@shared/shared.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { CpsIndexComponent } from '@app/modules/hrm/pages/staff-research/contract-process/cps-index/cps-index.component';
import { CpsFormComponent } from '@app/modules/hrm/pages/staff-research/contract-process/cps-form/cps-form.component';

@NgModule({
  declarations: [
    CpsIndexComponent,
    CpsFormComponent
  ],
  imports: [
    CommonModule,
    ContractProcessRoutingModule,
    SharedModule,
    StaffResearchCommonModule
  ]
})
export class ContractProcessModule { }
