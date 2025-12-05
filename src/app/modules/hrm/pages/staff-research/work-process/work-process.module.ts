import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WpsIndexComponent } from './wps-index/wps-index.component';
import { SharedModule } from '@shared/shared.module';
import { WorkProcessRoutingModule } from './work-process.routing.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { WpsFormComponent } from '@app/modules/hrm/pages/staff-research/work-process/wps-form/wps-form.component';

@NgModule({
  declarations: [
    WpsIndexComponent,
    WpsFormComponent
  ],
    imports: [
        CommonModule,
        WorkProcessRoutingModule,
        SharedModule,
        StaffResearchCommonModule
    ]
})
export class WorkProcessModule { }
