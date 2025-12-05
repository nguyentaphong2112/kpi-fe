import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CskhRoutingModule } from './cskh-routing.module';
import { CskhIndexComponent } from './cskh-index/cskh-index.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    CskhIndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CskhRoutingModule
  ]
})
export class CskhModule { }
