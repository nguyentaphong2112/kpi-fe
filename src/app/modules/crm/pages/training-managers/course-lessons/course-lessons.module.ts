import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {ClsIndexComponent} from "@app/modules/crm/pages/training-managers/course-lessons/cls-index/cls-index.component";
import {ClsFormComponent} from "@app/modules/crm/pages/training-managers/course-lessons/cls-form/cls-form.component";
import {CourseLessonsRoutingModule} from "@app/modules/crm/pages/training-managers/course-lessons/course-lessons.routing.module";

export function declaration() {
  return [ClsIndexComponent, ClsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, CourseLessonsRoutingModule]
})
export class CourseLessonsModule { }

