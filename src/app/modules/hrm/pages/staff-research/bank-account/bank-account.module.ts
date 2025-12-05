import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatIndexComponent } from './bat-index/bat-index.component';
import { BatFormComponent } from './bat-form/bat-form.component';
import { BankAccountRoutingModule } from '@app/modules/hrm/pages/staff-research/bank-account/bank-account.routing.module';
import { StaffResearchCommonModule } from '@app/modules/hrm/pages/staff-research/staff-research-common/staff-research-common.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    BatIndexComponent,
    BatFormComponent
  ],
  imports: [
    CommonModule,
    BankAccountRoutingModule,
    StaffResearchCommonModule,
    SharedModule
  ]
})
export class BankAccountModule { }
