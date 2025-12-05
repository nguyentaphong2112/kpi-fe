import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SrsIndexComponent } from './srs-index/srs-index.component';
import { SharedModule } from '@shared/shared.module';
import { SrsFormComponent } from './srs-form/srs-form.component';
import {
  SalaryRanksRoutingModule
} from '@app/modules/hrm/pages/category-manage/salary-ranks/salary-ranks.routing.module';

@NgModule({
  declarations: [
    SrsIndexComponent,
    SrsFormComponent
  ],
  imports: [
    CommonModule,
    SalaryRanksRoutingModule,
    SharedModule
  ]
})
export class SalaryRanksModule { }
