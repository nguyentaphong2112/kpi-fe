import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationProvideLevel1RoutingModule } from './organization-provide-level1-routing.module';
import { OplIndexComponent } from './opl-index/opl-index.component';
import { OplFormComponent } from './opl-form/opl-form.component';
import { EvaluationCriteriaComponent } from './evaluation-criteria/evaluation-criteria.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  OrganizationEvaluationsModule
} from '@app/modules/kpi/pages/kpi-provides/organization-evaluations/organization-evaluations.module';


@NgModule({
  declarations: [
    OplIndexComponent,
    OplFormComponent,
    EvaluationCriteriaComponent
  ],
  imports: [
    CommonModule,
    OrganizationProvideLevel1RoutingModule,
    NzFormModule,
    NzGridModule,
    NzModalModule,
    NzTagModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    OrganizationEvaluationsModule
  ]
})
export class OrganizationProvideLevel1Module { }
