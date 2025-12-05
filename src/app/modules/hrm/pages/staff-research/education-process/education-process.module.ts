import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpsIndexComponent } from './eps-index/eps-index.component';
import { EducationProcessRoutingModule } from './education-process.routing.module';
import { SharedModule } from '@shared/shared.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { EpsFormComponent } from '@app/modules/hrm/pages/staff-research/education-process/eps-form/eps-form.component';

@NgModule({
  declarations: [
    EpsIndexComponent,
    EpsFormComponent
  ],
    imports: [
        CommonModule,
        EducationProcessRoutingModule,
        SharedModule,
        StaffResearchCommonModule
    ]
})
export class EducationProcessModule { }
