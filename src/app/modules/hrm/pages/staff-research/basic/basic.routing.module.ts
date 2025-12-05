import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicIndexComponent } from './basic-index/basic-index.component';

const routes: Routes = [
  {
    path: '',
    component: BasicIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.basicInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicRoutingModule { }
