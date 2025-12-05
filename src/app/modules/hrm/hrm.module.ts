import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmRoutingModule } from '@app/modules/hrm/hrm.routing.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { SharedModule } from '@shared/shared.module';
import { StaffResearchCommonModule } from './pages/staff-research/staff-research-common/staff-research-common.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HrmRoutingModule,
    NzFormModule,
    SharedModule,
    StaffResearchCommonModule
  ]
})
export class HrmModule {
}
