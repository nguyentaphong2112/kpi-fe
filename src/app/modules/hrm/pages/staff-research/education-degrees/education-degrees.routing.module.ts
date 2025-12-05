import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EdsIndexComponent } from '@app/modules/hrm/pages/staff-research/education-degrees/eds-index/eds-index.component';

const routes: Routes = [
  {
    path: '',
    component: EdsIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.educationDegreesInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EducationDegreesRoutingModule { }
