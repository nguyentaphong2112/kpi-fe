import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtsIndexComponent } from './ets-index/ets-index.component';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { EtsFormComponent } from './ets-form/ets-form.component';
import { EmpTypesRoutingModule } from './emp-types.routing.module';

@NgModule({
  declarations: [
    EtsIndexComponent,
    EtsFormComponent
  ],
  imports: [
    CommonModule,
    EmpTypesRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class EmpTypesModule { }
