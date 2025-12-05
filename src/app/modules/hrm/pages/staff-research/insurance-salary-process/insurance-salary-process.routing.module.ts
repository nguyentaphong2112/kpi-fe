import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { IspIndexComponent } from './isp-index/isp-index.component';

const routes: Routes = [
  {
    path: '',
    component: IspIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.insuranceSalaryInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceSalaryProcessRoutingModule { }
