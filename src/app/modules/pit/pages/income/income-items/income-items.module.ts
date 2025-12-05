import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {IisIndexComponent} from "@app/modules/pit/pages/income/income-items/iis-index/iis-index.component";
import {IisFormComponent} from "@app/modules/pit/pages/income/income-items/iis-form/iis-form.component";
import {IncomeItemsRoutingModule} from "@app/modules/pit/pages/income/income-items/income-items.routing.module";

export function declaration() {
  return [IisIndexComponent, IisFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, IncomeItemsRoutingModule]
})
export class IncomeItemsModule { }

