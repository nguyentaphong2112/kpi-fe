import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersIndexComponent } from '@app/modules/admin/pages/permissions/users/users-index/users-index.component';
import { UsersRoleComponent } from '@app/modules/admin/pages/permissions/users/users-role/users-role.component';

const routes: Routes = [
  {
    path: '',
    component: UsersIndexComponent
  },
  {
    path: 'search',
    component: UsersIndexComponent
  },
  {
    path: 'users-role',
    component: UsersRoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
