import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {CtsIndexComponent} from "@app/modules/crm/pages/training-managers/course-trainees/cts-index/cts-index.component";
import {CtsFormComponent} from "@app/modules/crm/pages/training-managers/course-trainees/cts-form/cts-form.component";
import {CourseTraineesRoutingModule} from "@app/modules/crm/pages/training-managers/course-trainees/course-trainees.routing.module";

export function declaration() {
  return [CtsIndexComponent, CtsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, CourseTraineesRoutingModule]
})
export class CourseTraineesModule { }

