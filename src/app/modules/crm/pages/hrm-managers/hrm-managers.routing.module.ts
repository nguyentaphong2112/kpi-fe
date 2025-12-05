import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'family-relationships',
    loadChildren: () => import('../hrm-managers/family-relationships/family-relationships.module').then(m => m.FamilyRelationshipsModule)
  },
  {
    path: 'employees',
    loadChildren: () => import('../hrm-managers/employees/employees.module').then(m => m.EmployeesModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmManagersRoutingModule { }
