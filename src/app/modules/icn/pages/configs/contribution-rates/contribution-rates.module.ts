import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {CrsIndexComponent} from "@app/modules/icn/pages/configs/contribution-rates/crs-index/crs-index.component";
import {CrsFormComponent} from "@app/modules/icn/pages/configs/contribution-rates/crs-form/crs-form.component";
import {ContributionRatesRoutingModule} from "@app/modules/icn/pages/configs/contribution-rates/contribution-rates.routing.module";

export function declaration() {
  return [CrsIndexComponent, CrsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ContributionRatesRoutingModule]
})
export class ContributionRatesModule { }

