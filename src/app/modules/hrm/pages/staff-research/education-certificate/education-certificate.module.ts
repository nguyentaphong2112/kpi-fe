import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EceIndexComponent } from './ece-index/ece-index.component';
import { StaffResearchCommonModule } from '../staff-research-common/staff-research-common.module';
import { EducationCertificateRoutingModule } from './education-certificate.routing.module';
import { EceFormComponent } from './ece-form/ece-form.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    EceIndexComponent,
    EceFormComponent
  ],
  imports: [
    CommonModule,
    StaffResearchCommonModule,
    EducationCertificateRoutingModule,
    NzFormModule,
    SharedModule
  ]
})
export class EducationCertificateModule { }
