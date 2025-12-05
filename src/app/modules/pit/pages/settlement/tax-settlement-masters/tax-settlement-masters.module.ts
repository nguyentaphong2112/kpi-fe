import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {TsmIndexComponent} from "@app/modules/pit/pages/settlement/tax-settlement-masters/tsm-index/tsm-index.component";
import {TsmFormComponent} from "@app/modules/pit/pages/settlement/tax-settlement-masters/tsm-form/tsm-form.component";
import {TaxSettlementMastersRoutingModule} from "@app/modules/pit/pages/settlement/tax-settlement-masters/tax-settlement-masters.routing.module";
import {
  TaxSettlementMastersSyntheticComponent
} from "@app/modules/pit/pages/settlement/tax-settlement-masters/tax-settlement-masters-synthetic/tax-settlement-masters-synthetic.component";

export function declaration() {
  return [TsmIndexComponent, TsmFormComponent, TaxSettlementMastersSyntheticComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, TaxSettlementMastersRoutingModule]
})
export class TaxSettlementMastersModule { }

