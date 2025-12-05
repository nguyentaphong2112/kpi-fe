import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {TcsIndexComponent} from "@app/modules/pit/pages/commitments/tax-commitments/tcs-index/tcs-index.component";
import {TcsFormComponent} from "@app/modules/pit/pages/commitments/tax-commitments/tcs-form/tcs-form.component";
import {TaxCommitmentsRoutingModule} from "@app/modules/pit/pages/commitments/tax-commitments/tax-commitments.routing.module";

export function declaration() {
  return [TcsIndexComponent, TcsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, TaxCommitmentsRoutingModule]
})
export class TaxCommitmentsModule { }

