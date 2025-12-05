import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdsIndexComponent } from './eds-index/eds-index.component';
import { EducationDegreesRoutingModule } from './education-degrees.routing.module';
import { SharedModule } from '@shared/shared.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { EdsFormComponent } from '@app/modules/hrm/pages/staff-research/education-degrees/eds-form/eds-form.component';

@NgModule({
  declarations: [
    EdsIndexComponent,
    EdsFormComponent
  ],
    imports: [
        CommonModule,
        EducationDegreesRoutingModule,
        SharedModule,
        StaffResearchCommonModule
    ]
})
export class EducationDegreesModule { }
