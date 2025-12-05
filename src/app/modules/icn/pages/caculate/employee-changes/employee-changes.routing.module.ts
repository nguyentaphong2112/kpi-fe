import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EcsIndexComponent } from '@app/modules/icn/pages/caculate/employee-changes/ecs-index/ecs-index.component';
import { EcsFormComponent } from '@app/modules/icn/pages/caculate/employee-changes/ecs-form/ecs-form.component';


const routes: Routes = [
  {
    path: '',
    component: EcsIndexComponent
  },
  {
    path: 'form',
    component: EcsFormComponent,
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
export class EmployeeChangesRoutingModule {
}

