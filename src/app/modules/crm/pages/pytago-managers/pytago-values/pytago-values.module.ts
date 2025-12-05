import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {PvsIndexComponent} from "@app/modules/crm/pages/pytago-managers/pytago-values/pvs-index/pvs-index.component";
import {PvsFormComponent} from "@app/modules/crm/pages/pytago-managers/pytago-values/pvs-form/pvs-form.component";
import {PytagoValuesRoutingModule} from "@app/modules/crm/pages/pytago-managers/pytago-values/pytago-values.routing.module";

export function declaration() {
  return [PvsIndexComponent, PvsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, PytagoValuesRoutingModule]
})
export class PytagoValuesModule { }

