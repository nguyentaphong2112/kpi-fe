import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigIndexComponent } from '@app/modules/admin/pages/configurations/parameters/config-index/config-index.component';

const routes: Routes = [
  {
    path: 'search',
    component: ConfigIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametersRoutingModule {
}
