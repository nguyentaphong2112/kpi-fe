import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {EtsIndexComponent} from "@app/modules/lms/pages/training-managers/external-trainings/ets-index/ets-index.component";
import {EtsFormComponent} from "@app/modules/lms/pages/training-managers/external-trainings/ets-form/ets-form.component";
import {ExternalTrainingsRoutingModule} from "@app/modules/lms/pages/training-managers/external-trainings/external-trainings.routing.module";

export function declaration() {
  return [EtsIndexComponent, EtsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ExternalTrainingsRoutingModule]
})
export class ExternalTrainingsModule { }

