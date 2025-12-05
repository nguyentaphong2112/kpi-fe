import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {TpsIndexComponent} from "@app/modules/crm/pages/training-managers/training-programs/tps-index/tps-index.component";
import {TpsFormComponent} from "@app/modules/crm/pages/training-managers/training-programs/tps-form/tps-form.component";
import {TrainingProgramsRoutingModule} from "@app/modules/crm/pages/training-managers/training-programs/training-programs.routing.module";

export function declaration() {
  return [TpsIndexComponent, TpsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, TrainingProgramsRoutingModule]
})
export class TrainingProgramsModule { }

