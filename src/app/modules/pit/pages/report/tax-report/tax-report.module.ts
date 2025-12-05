import {TrtIndexComponent} from "@app/modules/pit/pages/report/tax-report/trt-index/trt-index.component";
import {NgModule} from "@angular/core";
import {SharedModule} from "@shared/shared.module";
import {TaxReportRoutingModule} from "@app/modules/pit/pages/report/tax-report/tax-report.routing.module";

export function declaration() {
  return [TrtIndexComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, TaxReportRoutingModule]
})
export class TaxReportModule { }

