import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportReportRoutingModule } from './export-report-routing.module';
import { ErtIndexComponent } from './ert-index/ert-index.component';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "@shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    ErtIndexComponent
  ],
  imports: [
    CommonModule,
    ExportReportRoutingModule,
    NzFormModule,
    NzGridModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ]
})
export class ExportReportModule { }
