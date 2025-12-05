import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationAggregateDataRoutingModule } from './organization-aggregate-data-routing.module';
import { OadIndexComponent } from './oad-index/oad-index.component';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '@shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [
    OadIndexComponent
  ],
  imports: [
    CommonModule,
    OrganizationAggregateDataRoutingModule,
    NzFormModule,
    NzGridModule,
    NzTagModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ]
})
export class OrganizationAggregateDataModule { }
