import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { sIndexComponent } from '@app/modules/icn/pages/caculate/insurance-retractions/irs-index/irs-index.component';
import { sFormComponent } from '@app/modules/icn/pages/caculate/insurance-retractions/irs-form/irs-form.component';


const routes: Routes = [
  {
    path: '',
    component: sIndexComponent
  },
  {
    path: 'form',
    component: sFormComponent,
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
export class InsuranceRetractionsRoutingModule {
}

