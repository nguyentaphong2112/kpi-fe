import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PytagoRoutingModule } from './pytago-routing.module';
import { PtoIndexComponent } from './pto-index/pto-index.component';
import { SharedModule } from '@shared/shared.module';
import { PtoLoginFormComponent } from './pto-login-form/pto-login-form.component';


@NgModule({
  declarations: [
    PtoIndexComponent,
    PtoLoginFormComponent
  ],
  exports: [
    PtoIndexComponent
  ],
  imports: [CommonModule, SharedModule, PytagoRoutingModule]
})
export class PytagoModule { }
