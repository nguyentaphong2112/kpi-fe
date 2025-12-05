import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GeneralInfoComponent} from '@app/modules/dashboard/pages/general-info/general-info.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
