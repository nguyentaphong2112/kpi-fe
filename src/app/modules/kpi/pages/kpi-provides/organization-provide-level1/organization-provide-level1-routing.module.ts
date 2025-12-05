import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  OplIndexComponent
} from '@app/modules/kpi/pages/kpi-provides/organization-provide-level1/opl-index/opl-index.component';
import {
  OplFormComponent
} from '@app/modules/kpi/pages/kpi-provides/organization-provide-level1/opl-form/opl-form.component';

const routes: Routes = [{
  path: '',
  component: OplIndexComponent
},
  {
    path: 'form',
    component: OplFormComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationProvideLevel1RoutingModule {
}
