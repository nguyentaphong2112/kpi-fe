import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TkgIndexComponent } from '@app/modules/abs/pages/timekeeping-manager/timekeepings/tkg-index/tkg-index.component';
import { TkgFormComponent } from '@app/modules/abs/pages/timekeeping-manager/timekeepings/tkg-form/tkg-form.component';


const routes: Routes = [
  {
    path: '',
    component: TkgIndexComponent
  },
  {
    path: 'form',
    component: TkgFormComponent,
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
export class TimekeepingsRoutingModule {
}

