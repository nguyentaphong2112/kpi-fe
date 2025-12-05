import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SrsIndexComponent } from '@app/modules/hrm/pages/salary-manager/salary-reviews/srs-index/srs-index.component';
import { SrsFormComponent } from '@app/modules/hrm/pages/salary-manager/salary-reviews/srs-form/srs-form.component';


const routes: Routes = [
  {
    path: '',
    component: SrsIndexComponent
  },
  {
    path: 'form',
    component: SrsFormComponent,
    data: {
      isShowBackBtn: true,
      pageName: 'Thêm mới',
      breadcrumb: 'Thêm mới'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryReviewsRoutingModule {
}

