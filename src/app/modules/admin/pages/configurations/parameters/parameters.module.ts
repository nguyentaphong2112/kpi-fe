import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametersRoutingModule } from './parameters.routing.module';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigFormComponent } from './config-form/config-form.component';
import { ConfigIndexComponent } from './config-index/config-index.component';
import { ParameterFormComponent } from './parameter-form/parameter-form.component';


@NgModule({
  declarations: [
    ConfigFormComponent,
    ConfigIndexComponent,
    ParameterFormComponent
  ],
  imports: [
    CommonModule,
    ParametersRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class ParametersModule {
}
