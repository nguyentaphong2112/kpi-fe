import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {sIndexComponent} from "@app/modules/icn/pages/caculate/insurance-retractions/irs-index/irs-index.component";
import {sFormComponent} from "@app/modules/icn/pages/caculate/insurance-retractions/irs-form/irs-form.component";
import {InsuranceRetractionsRoutingModule} from "@app/modules/icn/pages/caculate/insurance-retractions/insurance-retractions.routing.module";
import {MakeListComponent} from "@app/modules/icn/pages/caculate/insurance-retractions/make-list/make-list.component";

export function declaration() {
  return [sIndexComponent, sFormComponent,MakeListComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, InsuranceRetractionsRoutingModule]
})
export class InsuranceRetractionsModule { }

