import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EmployeesIndexComponent } from '@app/modules/crm/pages/hrm-managers/employees/employees-index/employees-index.component';
import { EmployeesFormComponent } from '@app/modules/crm/pages/hrm-managers/employees/employees-form/employees-form.component';


const routes: Routes = [
  {
    path: '',
    component: EmployeesIndexComponent
  },
  {
    path: 'form',
    component: EmployeesFormComponent,
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
export class EmployeesRoutingModule {
}

