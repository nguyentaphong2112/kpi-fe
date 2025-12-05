import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrsIndexComponent } from '@app/modules/admin/pages/configurations/dynamic-reports/drs-index/drs-index.component';

const routes: Routes = [
  {
    path: 'search',
    component: DrsIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicReportsRoutingModule {
}
