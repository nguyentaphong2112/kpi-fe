import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {MvsIndexComponent} from "@app/modules/admin/pages/configurations/mapping-values/mvs-index/mvs-index.component";
import {MvsFormComponent} from "@app/modules/admin/pages/configurations/mapping-values/mvs-form/mvs-form.component";
import {MappingValuesRoutingModule} from "@app/modules/admin/pages/configurations/mapping-values/mapping-values.routing.module";

export function declaration() {
  return [MvsIndexComponent, MvsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, MappingValuesRoutingModule]
})
export class MappingValuesModule { }

