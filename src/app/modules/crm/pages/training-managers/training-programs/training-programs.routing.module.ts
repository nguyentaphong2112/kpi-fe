import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TpsIndexComponent } from '@app/modules/crm/pages/training-managers/training-programs/tps-index/tps-index.component';
import { TpsFormComponent } from '@app/modules/crm/pages/training-managers/training-programs/tps-form/tps-form.component';


const routes: Routes = [
  {
    path: '',
    component: TpsIndexComponent
  },
  {
    path: 'form',
    component: TpsFormComponent,
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
export class TrainingProgramsRoutingModule {
}

