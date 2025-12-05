import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RequestsIndexComponent } from '@app/modules/abs/pages/request-manager/requests/requests-index/requests-index.component';
import { RequestsFormComponent } from '@app/modules/abs/pages/request-manager/requests/requests-form/requests-form.component';


const routes: Routes = [
  {
    path: '',
    component: RequestsIndexComponent
  },
  {
    path: 'form',
    component: RequestsFormComponent,
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
export class RequestsRoutingModule {
}

