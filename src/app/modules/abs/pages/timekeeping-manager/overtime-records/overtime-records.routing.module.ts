import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrsIndexComponent } from '@app/modules/abs/pages/timekeeping-manager/overtime-records/ors-index/ors-index.component';
import { OrsFormComponent } from '@app/modules/abs/pages/timekeeping-manager/overtime-records/ors-form/ors-form.component';


const routes: Routes = [
  {
    path: '',
    component: OrsIndexComponent
  },
  {
    path: 'form',
    component: OrsFormComponent,
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
export class OvertimeRecordsRoutingModule {
}

