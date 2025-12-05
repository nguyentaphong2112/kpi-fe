import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {sIndexComponent} from "@app/modules/icn/pages/caculate/insurance-retractions/irs-index/irs-index.component";
import {sFormComponent} from "@app/modules/icn/pages/caculate/insurance-retractions/irs-form/irs-form.component";
import {ReportViewComponent} from "@app/modules/icn/pages/caculate/report/report-view/report-view.component";

const routes: Routes = [
  {
    path: '',
    component: ReportViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
