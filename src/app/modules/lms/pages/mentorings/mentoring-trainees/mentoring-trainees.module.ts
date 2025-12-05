import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {MtsIndexComponent} from "@app/modules/lms/pages/mentorings/mentoring-trainees/mts-index/mts-index.component";
import {MtsFormComponent} from "@app/modules/lms/pages/mentorings/mentoring-trainees/mts-form/mts-form.component";
import {MentoringTraineesRoutingModule} from "@app/modules/lms/pages/mentorings/mentoring-trainees/mentoring-trainees.routing.module";

export function declaration() {
  return [MtsIndexComponent, MtsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, MentoringTraineesRoutingModule]
})
export class MentoringTraineesModule { }

