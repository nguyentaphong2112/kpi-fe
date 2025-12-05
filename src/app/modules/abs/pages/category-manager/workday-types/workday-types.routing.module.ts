import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { WtsIndexComponent } from '@app/modules/abs/pages/category-manager/workday-types/wts-index/wts-index.component';
import { WtsFormComponent } from '@app/modules/abs/pages/category-manager/workday-types/wts-form/wts-form.component';


const routes: Routes = [
  {
    path: '',
    component: WtsIndexComponent
  },
  {
    path: 'form',
    component: WtsFormComponent,
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
export class WorkdayTypesRoutingModule {
}

