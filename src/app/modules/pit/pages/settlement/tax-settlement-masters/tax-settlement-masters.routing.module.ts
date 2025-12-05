import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TsmIndexComponent } from '@app/modules/pit/pages/settlement/tax-settlement-masters/tsm-index/tsm-index.component';
import { TsmFormComponent } from '@app/modules/pit/pages/settlement/tax-settlement-masters/tsm-form/tsm-form.component';


const routes: Routes = [
  {
    path: '',
    component: TsmIndexComponent
  },
  {
    path: 'form',
    component: TsmFormComponent,
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
export class TaxSettlementMastersRoutingModule {
}

