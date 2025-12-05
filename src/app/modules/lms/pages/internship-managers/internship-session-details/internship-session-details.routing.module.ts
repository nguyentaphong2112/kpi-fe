import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IsdIndexComponent } from '@app/modules/lms/pages/internship-managers/internship-session-details/isd-index/isd-index.component';
import { IsdFormComponent } from '@app/modules/lms/pages/internship-managers/internship-session-details/isd-form/isd-form.component';


const routes: Routes = [
  {
    path: '',
    component: IsdIndexComponent
  },
  {
    path: 'form',
    component: IsdFormComponent,
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
export class InternshipSessionDetailsRoutingModule {
}

