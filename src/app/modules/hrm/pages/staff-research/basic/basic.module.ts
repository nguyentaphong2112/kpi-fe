import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicIndexComponent } from './basic-index/basic-index.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { BasicRoutingModule } from './basic.routing.module';
import { BasicFormComponent } from '@app/modules/hrm/pages/staff-research/basic/basic-form/basic-form.component';
import { SharedModule } from '@shared/shared.module';
import { EmployeeAddComponent } from '@app/modules/hrm/pages/staff-research/basic/employee-add/employee-add.component';

@NgModule({
  declarations: [
    BasicIndexComponent,
    BasicFormComponent,
    EmployeeAddComponent
  ],
    imports: [
        CommonModule,
        BasicRoutingModule,
        NzTagModule,
        SharedModule,
        StaffResearchCommonModule
    ]
})
export class BasicModule { }
