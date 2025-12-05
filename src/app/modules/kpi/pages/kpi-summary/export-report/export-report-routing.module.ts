import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErtIndexComponent } from '@app/modules/kpi/pages/kpi-summary/export-report/ert-index/ert-index.component';

const routes: Routes = [
  {
    path: '',
    component: ErtIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportReportRoutingModule { }
