import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {CpsIndexComponent} from "@app/modules/admin/pages/configurations/config-pages/cps-index/cps-index.component";
import {CpsFormComponent} from "@app/modules/admin/pages/configurations/config-pages/cps-form/cps-form.component";
import {ConfigPagesRoutingModule} from "@app/modules/admin/pages/configurations/config-pages/config-pages.routing.module";

export function declaration() {
  return [CpsIndexComponent, CpsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ConfigPagesRoutingModule]
})
export class ConfigPagesModule { }

