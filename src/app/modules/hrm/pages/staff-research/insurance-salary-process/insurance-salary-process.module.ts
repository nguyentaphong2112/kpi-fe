import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IspIndexComponent } from './isp-index/isp-index.component';
import { InsuranceSalaryProcessRoutingModule } from './insurance-salary-process.routing.module';
import { SharedModule } from '@shared/shared.module';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { IpsFormComponent } from '@app/modules/hrm/pages/staff-research/insurance-salary-process/ips-form/ips-form.component';

@NgModule({
  declarations: [
    IspIndexComponent,
    IpsFormComponent
  ],
    imports: [
        CommonModule,
        InsuranceSalaryProcessRoutingModule,
        SharedModule,
        StaffResearchCommonModule
    ]
})
export class InsuranceSalaryProcessModule { }
