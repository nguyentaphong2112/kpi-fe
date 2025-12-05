import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CpsIndexComponent } from './cps-index/cps-index.component';

const routes: Routes = [
  {
    path: '',
    component: CpsIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.concurrentProcessInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConcurrentProcessRoutingModule { }
