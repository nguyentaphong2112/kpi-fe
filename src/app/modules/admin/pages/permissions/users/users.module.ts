import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users.routing.module';
import { UsersFormComponent } from './users-form/users-form.component';
import { UsersIndexComponent } from './users-index/users-index.component';
import { SharedModule } from '@shared/shared.module';
import { UsersRoleComponent } from './users-role/users-role.component';
import { ScopePopupComponent } from './scope-popup/scope-popup.component';

@NgModule({
  declarations: [
    UsersFormComponent,
    UsersIndexComponent,
    UsersRoleComponent,
    ScopePopupComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule {
}
