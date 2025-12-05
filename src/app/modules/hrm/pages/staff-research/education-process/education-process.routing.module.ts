import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpsIndexComponent } from './eps-index/eps-index.component';

const routes: Routes = [
  {
    path: '',
    component: EpsIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.educationProcessInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EducationProcessRoutingModule { }
