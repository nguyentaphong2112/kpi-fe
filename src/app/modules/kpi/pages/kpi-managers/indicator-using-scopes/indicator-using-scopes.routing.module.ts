import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IusIndexComponent } from '@app/modules/kpi/pages/kpi-managers/indicator-using-scopes/ius-index/ius-index.component';
import { IusFormComponent } from '@app/modules/kpi/pages/kpi-managers/indicator-using-scopes/ius-form/ius-form.component';


const routes: Routes = [
  {
    path: '',
    component: IusIndexComponent
  },
  {
    path: 'form',
    component: IusFormComponent,
    data: {
      isShowBackBtn: true,
      pageName: 'thêm mới',
      breadcrumb: 'thêm mới'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicatorUsingScopesRoutingModule {
}

