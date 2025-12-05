import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PinIndexComponent } from './pin-index/pin-index.component';


@NgModule({
  declarations: [
    PinIndexComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PersonalInformationModule {
}
