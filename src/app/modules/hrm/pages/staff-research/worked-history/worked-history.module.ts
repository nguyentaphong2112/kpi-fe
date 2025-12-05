import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyIndexComponent } from './why-index/why-index.component';
import { SharedModule } from '@shared/shared.module';
import { WorkedHistoryRoutingModule } from './worked-history.routing.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { WhyFormComponent } from '@app/modules/hrm/pages/staff-research/worked-history/why-form/why-form.component';

@NgModule({
  declarations: [
    WhyIndexComponent,
    WhyFormComponent
  ],
    imports: [
        CommonModule,
        WorkedHistoryRoutingModule,
        SharedModule,
        StaffResearchCommonModule
    ]
})
export class WorkedHistoryModule { }
