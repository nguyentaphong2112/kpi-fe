import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpsIndexComponent } from './cps-index/cps-index.component';
import { SharedModule } from '@shared/shared.module';
import { ConcurrentProcessRoutingModule } from './concurrent-process.routing.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { CpsFormComponent } from '@app/modules/hrm/pages/staff-research/concurrent-process/cps-form/cps-form.component';

@NgModule({
  declarations: [
    CpsIndexComponent,
    CpsFormComponent
  ],
    imports: [
        CommonModule,
        ConcurrentProcessRoutingModule,
        SharedModule,
        StaffResearchCommonModule
    ]
})
export class ConcurrentProcessModule { }
