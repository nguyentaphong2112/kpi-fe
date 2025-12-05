import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TcsIndexComponent } from '@app/modules/pit/pages/commitments/tax-commitments/tcs-index/tcs-index.component';
import { TcsFormComponent } from '@app/modules/pit/pages/commitments/tax-commitments/tcs-form/tcs-form.component';


const routes: Routes = [
  {
    path: '',
    component: TcsIndexComponent
  },
  {
    path: 'form',
    component: TcsFormComponent,
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
export class TaxCommitmentsRoutingModule {
}

