import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErsIndexComponent } from './ers-index/ers-index.component';
import { ErsFormComponent } from './ers-form/ers-form.component';
import { EvaluationResultsRoutingModule } from '@app/modules/hrm/pages/staff-research/evaluation-results/evaluation-results.routing.module';
import { SharedModule } from '@shared/shared.module';
import { StaffResearchCommonModule } from '@app/modules/hrm/pages/staff-research/staff-research-common/staff-research-common.module';

@NgModule({
  declarations: [
    ErsIndexComponent,
    ErsFormComponent
  ],
  imports: [
    CommonModule,
    EvaluationResultsRoutingModule,
    SharedModule,
    StaffResearchCommonModule
  ]
})
export class EvaluationResultsModule { }
