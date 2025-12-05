import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {CmsIndexComponent} from "@app/modules/admin/pages/configurations/config-mappings/cms-index/cms-index.component";
import {CmsFormComponent} from "@app/modules/admin/pages/configurations/config-mappings/cms-form/cms-form.component";
import {ConfigMappingsRoutingModule} from "@app/modules/admin/pages/configurations/config-mappings/config-mappings.routing.module";

export function declaration() {
  return [CmsIndexComponent, CmsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ConfigMappingsRoutingModule]
})
export class ConfigMappingsModule { }

