import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {EcsIndexComponent} from "@app/modules/icn/pages/caculate/employee-changes/ecs-index/ecs-index.component";
import {EcsFormComponent} from "@app/modules/icn/pages/caculate/employee-changes/ecs-form/ecs-form.component";
import {EmployeeChangesRoutingModule} from "@app/modules/icn/pages/caculate/employee-changes/employee-changes.routing.module";

export function declaration() {
  return [EcsIndexComponent, EcsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, EmployeeChangesRoutingModule]
})
export class EmployeeChangesModule { }

