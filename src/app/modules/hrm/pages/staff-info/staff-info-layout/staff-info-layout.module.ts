import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { StaffInfoModule } from '@app/modules/hrm/pages/staff-info/staff-info.module';
import { HeaderInfoModule } from '@app/modules/hrm/pages/staff-info/header-info/header-info.module';
import { SilIndexComponent } from '@app/modules/hrm/pages/staff-info/staff-info-layout/sil-index/sil-index.component';
import { StaffInfoLayoutRoutingModule } from './staff-info-layout.routing.module';

@NgModule({
  declarations: [SilIndexComponent],
  imports: [
    CommonModule,
    SharedModule,
    StaffInfoLayoutRoutingModule,
    StaffInfoModule,
    HeaderInfoModule
  ]
})
export class StaffInfoLayoutModule {
}
