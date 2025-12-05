import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationSummaryRoutingModule } from './organization-summary-routing.module';
import { OsyIndexComponent } from './osy-index/osy-index.component';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzTagModule} from "ng-zorro-antd/tag";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "@shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    OsyIndexComponent
  ],
  imports: [
    CommonModule,
    OrganizationSummaryRoutingModule,
    NzFormModule,
    NzGridModule,
    NzTagModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ]
})
export class OrganizationSummaryModule { }
