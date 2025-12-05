import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PvsIndexComponent } from '@app/modules/crm/pages/pytago-managers/pytago-values/pvs-index/pvs-index.component';
import { PvsFormComponent } from '@app/modules/crm/pages/pytago-managers/pytago-values/pvs-form/pvs-form.component';


const routes: Routes = [
  {
    path: '',
    component: PvsIndexComponent
  },
  {
    path: 'form',
    component: PvsFormComponent,
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
export class PytagoValuesRoutingModule {
}

