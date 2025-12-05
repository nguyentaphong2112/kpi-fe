import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudFormComponent } from './compoments/crud-form/crud-form.component';
import { CoreModule } from '@core/core.module';
import { ControlMessagesComponent } from '@app/core-update/compoments/control-messages/control-messages.component';



@NgModule({
  declarations: [
    CrudFormComponent,
    ControlMessagesComponent
  ],
  exports: [
    CrudFormComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class CoreUpdateModule { }
