import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportReportRoutingModule } from './export-report-routing.module';
import { ErtIndexComponent } from './ert-index/ert-index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ErtIndexComponent
  ],
  imports: [
    CommonModule,
    ExportReportRoutingModule,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzIconModule,
    NzTableModule,
    NzToolTipModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ]
})
export class ExportReportModule { }
