import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {
  CoursesIndexComponent
} from '@app/modules/crm/pages/training-managers/courses/courses-index/courses-index.component';
import {
  CoursesFormComponent
} from '@app/modules/crm/pages/training-managers/courses/courses-form/courses-form.component';
import { CoursesRoutingModule } from '@app/modules/crm/pages/training-managers/courses/courses.routing.module';
import {
  OrganizationEvaluationsModule
} from '@app/modules/kpi/pages/kpi-evaluations/organization-evaluations/organization-evaluations.module';
import {
  ScoresFormComponent
} from '@app/modules/crm/pages/training-managers/courses/scores-form/scores-form.component';

export function declaration() {
  return [CoursesIndexComponent, CoursesFormComponent, ScoresFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, CoursesRoutingModule, OrganizationEvaluationsModule]
})
export class CoursesModule { }

