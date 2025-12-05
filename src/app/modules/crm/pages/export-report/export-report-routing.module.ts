import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ErtIndexComponent} from "@app/modules/crm/pages/export-report/ert-index/ert-index.component";

const routes: Routes = [{
  path: 'export',
  component: ErtIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportReportRoutingModule { }
