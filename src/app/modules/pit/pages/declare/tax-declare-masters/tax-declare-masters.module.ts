import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {TdmIndexComponent} from "@app/modules/pit/pages/declare/tax-declare-masters/tdm-index/tdm-index.component";
import {TdmFormComponent} from "@app/modules/pit/pages/declare/tax-declare-masters/tdm-form/tdm-form.component";
import {TaxDeclareMastersRoutingModule} from "@app/modules/pit/pages/declare/tax-declare-masters/tax-declare-masters.routing.module";
import {
  CalculateDeclareComponent
} from "@app/modules/pit/pages/declare/tax-declare-masters/calculate-declare/calculate-declare.component";
export function declaration() {
  return [TdmIndexComponent, TdmFormComponent, CalculateDeclareComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, TaxDeclareMastersRoutingModule]
})
export class TaxDeclareMastersModule { }

