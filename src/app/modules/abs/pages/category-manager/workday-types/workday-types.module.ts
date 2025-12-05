import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {WtsIndexComponent} from "@app/modules/abs/pages/category-manager/workday-types/wts-index/wts-index.component";
import {WtsFormComponent} from "@app/modules/abs/pages/category-manager/workday-types/wts-form/wts-form.component";
import {WorkdayTypesRoutingModule} from "@app/modules/abs/pages/category-manager/workday-types/workday-types.routing.module";

export function declaration() {
  return [WtsIndexComponent, WtsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, WorkdayTypesRoutingModule]
})
export class WorkdayTypesModule { }

