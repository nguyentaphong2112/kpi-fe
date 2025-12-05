import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {TpsIndexComponent} from "@app/modules/lms/pages/training-managers/training-process/tps-index/tps-index.component";
import {TpsFormComponent} from "@app/modules/lms/pages/training-managers/training-process/tps-form/tps-form.component";
import {TrainingProcessRoutingModule} from "@app/modules/lms/pages/training-managers/training-process/training-process.routing.module";

export function declaration() {
  return [TpsIndexComponent, TpsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, TrainingProcessRoutingModule]
})
export class TrainingProcessModule { }

