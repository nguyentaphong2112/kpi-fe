import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {RequestsIndexComponent} from "@app/modules/abs/pages/request-manager/requests/requests-index/requests-index.component";
import {RequestsFormComponent} from "@app/modules/abs/pages/request-manager/requests/requests-form/requests-form.component";
import {RequestsRoutingModule} from "@app/modules/abs/pages/request-manager/requests/requests.routing.module";
import {
    StaffResearchCommonModule
} from "@app/modules/hrm/pages/staff-research/staff-research-common/staff-research-common.module";

export function declaration() {
  return [RequestsIndexComponent, RequestsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
    imports: [SharedModule, RequestsRoutingModule, StaffResearchCommonModule]
})
export class RequestsModule { }

