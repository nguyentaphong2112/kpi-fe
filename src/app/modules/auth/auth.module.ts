import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth.routing.module';
import { LoginComponent } from '@app/modules/auth/pages/login/login.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ChangePasswordComponent } from '@app/modules/auth/pages/change-password/change-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    SharedModule,
  ]
})
export class AuthModule {
}
