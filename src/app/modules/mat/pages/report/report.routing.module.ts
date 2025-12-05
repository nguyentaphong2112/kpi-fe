import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MrtIndexComponent } from '@app/modules/mat/pages/report/mrt-index/mrt-index.component';


const routes: Routes = [
  {
    path: '',
    component: MrtIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}

