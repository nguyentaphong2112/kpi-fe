import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IcsIndexComponent } from '@app/modules/icn/pages/caculate/insurance-contributions/ics-index/ics-index.component';
import { IcsFormComponent } from '@app/modules/icn/pages/caculate/insurance-contributions/ics-form/ics-form.component';


const routes: Routes = [
  {
    path: '',
    component: IcsIndexComponent
  },
  {
    path: 'form',
    component: IcsFormComponent,
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
export class InsuranceContributionsRoutingModule {
}

