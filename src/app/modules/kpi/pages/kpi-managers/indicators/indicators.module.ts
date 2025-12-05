import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {IndicatorsIndexComponent} from "@app/modules/kpi/pages/kpi-managers/indicators/indicators-index/indicators-index.component";
import {IndicatorsFormComponent} from "@app/modules/kpi/pages/kpi-managers/indicators/indicators-form/indicators-form.component";
import {IndicatorsRoutingModule} from "@app/modules/kpi/pages/kpi-managers/indicators/indicators.routing.module";

export function declaration() {
  return [IndicatorsIndexComponent, IndicatorsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, IndicatorsRoutingModule]
})
export class IndicatorsModule { }

