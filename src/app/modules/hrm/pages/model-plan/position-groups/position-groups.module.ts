import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositionGroupsRoutingModule } from './position-groups-routing.module';
import { PgsIndexComponent } from './pgs-index/pgs-index.component';
import { PgsFormComponent } from './pgs-form/pgs-form.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PgsIndexComponent,
    PgsFormComponent
  ],
  imports: [
    CommonModule,
    PositionGroupsRoutingModule,
    SharedModule
  ]
})
export class PositionGroupsModule {
}
