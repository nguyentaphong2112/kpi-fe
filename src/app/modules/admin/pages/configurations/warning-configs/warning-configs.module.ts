import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {WcsIndexComponent} from "@app/modules/admin/pages/configurations/warning-configs/wcs-index/wcs-index.component";
import {WcsFormComponent} from "@app/modules/admin/pages/configurations/warning-configs/wcs-form/wcs-form.component";
import {WarningConfigsRoutingModule} from "@app/modules/admin/pages/configurations/warning-configs/warning-configs.routing.module";

export function declaration() {
  return [WcsIndexComponent, WcsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, WarningConfigsRoutingModule]
})
export class WarningConfigsModule { }

