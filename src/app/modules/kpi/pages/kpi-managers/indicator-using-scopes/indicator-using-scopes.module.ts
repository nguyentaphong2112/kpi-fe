import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {IusIndexComponent} from "@app/modules/kpi/pages/kpi-managers/indicator-using-scopes/ius-index/ius-index.component";
import {IusFormComponent} from "@app/modules/kpi/pages/kpi-managers/indicator-using-scopes/ius-form/ius-form.component";
import {IndicatorUsingScopesRoutingModule} from "@app/modules/kpi/pages/kpi-managers/indicator-using-scopes/indicator-using-scopes.routing.module";

export function declaration() {
  return [IusIndexComponent, IusFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, IndicatorUsingScopesRoutingModule]
})
export class IndicatorUsingScopesModule { }

