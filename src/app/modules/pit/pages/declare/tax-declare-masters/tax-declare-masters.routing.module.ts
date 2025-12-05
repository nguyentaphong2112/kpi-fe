import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TdmIndexComponent } from '@app/modules/pit/pages/declare/tax-declare-masters/tdm-index/tdm-index.component';
import { TdmFormComponent } from '@app/modules/pit/pages/declare/tax-declare-masters/tdm-form/tdm-form.component';


const routes: Routes = [
  {
    path: '',
    component: TdmIndexComponent
  },
  {
    path: 'form',
    component: TdmFormComponent,
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
export class TaxDeclareMastersRoutingModule {
}

