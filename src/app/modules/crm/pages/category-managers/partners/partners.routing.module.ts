import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PartnersIndexComponent } from '@app/modules/crm/pages/category-managers/partners/partners-index/partners-index.component';
import { PartnersFormComponent } from '@app/modules/crm/pages/category-managers/partners/partners-form/partners-form.component';


const routes: Routes = [
  {
    path: '',
    component: PartnersIndexComponent
  },
  {
    path: 'form',
    component: PartnersFormComponent,
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
export class PartnersRoutingModule {
}

