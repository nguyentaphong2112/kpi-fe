import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EceIndexComponent } from './ece-index/ece-index.component';

const routes: Routes = [
  {
    path: '',
    component: EceIndexComponent,
    data: {
      pageName: 'hrm.staffManager.staffResearch.pageName.educationCertificatesInfo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EducationCertificateRoutingModule { }
