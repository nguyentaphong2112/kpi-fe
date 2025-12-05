import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IisIndexComponent } from '@app/modules/pit/pages/income/income-items/iis-index/iis-index.component';
import { IisFormComponent } from '@app/modules/pit/pages/income/income-items/iis-form/iis-form.component';


const routes: Routes = [
  {
    path: '',
    component: IisIndexComponent
  },
  {
    path: 'form',
    component: IisFormComponent,
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
export class IncomeItemsRoutingModule {
}

