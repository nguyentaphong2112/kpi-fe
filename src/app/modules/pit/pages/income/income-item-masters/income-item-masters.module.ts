import {NgModule} from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {IimIndexComponent} from "@app/modules/pit/pages/income/income-item-masters/iim-index/iim-index.component";
import {IimFormComponent} from "@app/modules/pit/pages/income/income-item-masters/iim-form/iim-form.component";
import {
  IncomeItemMastersRoutingModule
} from "@app/modules/pit/pages/income/income-item-masters/income-item-masters.routing.module";

export function declaration() {
  return [IimIndexComponent, IimFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, IncomeItemMastersRoutingModule]
})
export class IncomeItemMastersModule { }

