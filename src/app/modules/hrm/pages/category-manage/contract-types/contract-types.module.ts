import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractTypesRoutingModule } from './contract-types.routing.module';
import { CtsIndexComponent } from './cts-index/cts-index.component';
import { CtsFormComponent } from './cts-form/cts-form.component';
import { SharedModule } from '@shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CtsIndexComponent,
    CtsFormComponent
  ],
  imports: [
    CommonModule,
    ContractTypesRoutingModule,
    SharedModule,
    NzFormModule,
    NzGridModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class ContractTypesModule { }
