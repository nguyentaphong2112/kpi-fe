import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportViewComponent } from './report-view/report-view.component';
import {sIndexComponent} from "@app/modules/icn/pages/caculate/insurance-retractions/irs-index/irs-index.component";
import {sFormComponent} from "@app/modules/icn/pages/caculate/insurance-retractions/irs-form/irs-form.component";
import {MakeListComponent} from "@app/modules/icn/pages/caculate/insurance-retractions/make-list/make-list.component";
import {SharedModule} from "@shared/shared.module";
import {
  InsuranceRetractionsRoutingModule
} from "@app/modules/icn/pages/caculate/insurance-retractions/insurance-retractions.routing.module";

export function declaration() {
  return [ReportViewComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ReportRoutingModule]
})
export class ReportModule { }
