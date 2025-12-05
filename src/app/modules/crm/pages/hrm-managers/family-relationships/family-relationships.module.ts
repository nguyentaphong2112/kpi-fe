import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {FrsIndexComponent} from "@app/modules/crm/pages/hrm-managers/family-relationships/frs-index/frs-index.component";
import {FrsFormComponent} from "@app/modules/crm/pages/hrm-managers/family-relationships/frs-form/frs-form.component";
import {FamilyRelationshipsRoutingModule} from "@app/modules/crm/pages/hrm-managers/family-relationships/family-relationships.routing.module";

export function declaration() {
  return [FrsIndexComponent, FrsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, FamilyRelationshipsRoutingModule]
})
export class FamilyRelationshipsModule { }

