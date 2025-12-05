import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CmsIndexComponent } from '@app/modules/admin/pages/configurations/config-mappings/cms-index/cms-index.component';
import { CmsFormComponent } from '@app/modules/admin/pages/configurations/config-mappings/cms-form/cms-form.component';


const routes: Routes = [
  {
    path: '',
    component: CmsIndexComponent
  },
  {
    path: 'form',
    component: CmsFormComponent,
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
export class ConfigMappingsRoutingModule {
}

