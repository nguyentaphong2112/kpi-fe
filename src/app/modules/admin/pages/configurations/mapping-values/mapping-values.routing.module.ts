import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MvsIndexComponent } from '@app/modules/admin/pages/configurations/mapping-values/mvs-index/mvs-index.component';
import { MvsFormComponent } from '@app/modules/admin/pages/configurations/mapping-values/mvs-form/mvs-form.component';


const routes: Routes = [
  {
    path: '',
    component: MvsIndexComponent
  },
  {
    path: 'form',
    component: MvsFormComponent,
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
export class MappingValuesRoutingModule {
}

