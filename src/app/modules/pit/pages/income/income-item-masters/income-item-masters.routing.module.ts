import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {IimIndexComponent} from '@app/modules/pit/pages/income/income-item-masters/iim-index/iim-index.component';
import {IimFormComponent} from '@app/modules/pit/pages/income/income-item-masters/iim-form/iim-form.component';


const routes: Routes = [
  {
    path: '',
    component: IimIndexComponent
  },
  {
    path: 'form',
    component: IimFormComponent,
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
export class IncomeItemMastersRoutingModule {
}

