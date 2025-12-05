import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CrsIndexComponent } from '@app/modules/icn/pages/configs/contribution-rates/crs-index/crs-index.component';
import { CrsFormComponent } from '@app/modules/icn/pages/configs/contribution-rates/crs-form/crs-form.component';


const routes: Routes = [
  {
    path: '',
    component: CrsIndexComponent
  },
  {
    path: 'form',
    component: CrsFormComponent,
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
export class ContributionRatesRoutingModule {
}

