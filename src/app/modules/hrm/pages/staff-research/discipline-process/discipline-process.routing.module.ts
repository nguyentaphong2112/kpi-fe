import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DpsIndexComponent } from './dps-index/dps-index.component';

const routes: Routes = [
  {
    path: '',
    component: DpsIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.disciplineProcessInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisciplineProcessRoutingModule { }
