import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {MtsIndexComponent} from "@app/modules/lms/pages/mentorings/mentoring-trainers/mts-index/mts-index.component";
import {MtsFormComponent} from "@app/modules/lms/pages/mentorings/mentoring-trainers/mts-form/mts-form.component";
import {MentoringTrainersRoutingModule} from "@app/modules/lms/pages/mentorings/mentoring-trainers/mentoring-trainers.routing.module";

export function declaration() {
  return [MtsIndexComponent, MtsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, MentoringTrainersRoutingModule]
})
export class MentoringTrainersModule { }

