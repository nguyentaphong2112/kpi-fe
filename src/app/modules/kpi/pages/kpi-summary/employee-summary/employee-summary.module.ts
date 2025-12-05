import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EmployeeSummaryRoutingModule} from './employee-summary-routing.module';
import {EsyIndexComponent} from './esy-index/esy-index.component';
import {CoreModule} from "@core/core.module";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzTagModule} from "ng-zorro-antd/tag";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "@shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    EsyIndexComponent
  ],
  imports: [
    CommonModule,
    EmployeeSummaryRoutingModule,
    CoreModule,
    NzFormModule,
    NzGridModule,
    NzModalModule,
    NzTagModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ]
})
export class EmployeeSummaryModule { }
