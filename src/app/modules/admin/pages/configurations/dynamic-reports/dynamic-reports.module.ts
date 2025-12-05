import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicReportsRoutingModule } from './dynamic-reports.routing.module';
import { DrsIndexComponent } from './drs-index/drs-index.component';
import { DrsFormComponent } from './drs-form/drs-form.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DrsIndexComponent,
    DrsFormComponent
  ],
  imports: [
    CommonModule,
    DynamicReportsRoutingModule,
    NzFormModule,
    NzGridModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ]
})
export class DynamicReportsModule { }
