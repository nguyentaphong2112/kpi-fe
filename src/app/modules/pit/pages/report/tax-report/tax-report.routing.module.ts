import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {TrtIndexComponent} from "@app/modules/pit/pages/report/tax-report/trt-index/trt-index.component";


const routes: Routes = [
  {
    path: '',
    component: TrtIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxReportRoutingModule {
}

