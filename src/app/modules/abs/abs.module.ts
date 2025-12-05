import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { SharedModule } from '@shared/shared.module';
import { AbsRoutingModule } from '@app/modules/abs/abs.routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AbsRoutingModule,
    NzFormModule,
    SharedModule
  ]
})
export class AbsModule {
}
