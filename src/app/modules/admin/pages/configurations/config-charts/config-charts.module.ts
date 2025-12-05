import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {CcsIndexComponent} from "@app/modules/admin/pages/configurations/config-charts/ccs-index/ccs-index.component";
import {CcsFormComponent} from "@app/modules/admin/pages/configurations/config-charts/ccs-form/ccs-form.component";
import {ConfigChartsRoutingModule} from "@app/modules/admin/pages/configurations/config-charts/config-charts.routing.module";

export function declaration() {
  return [CcsIndexComponent, CcsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ConfigChartsRoutingModule]
})
export class ConfigChartsModule { }

