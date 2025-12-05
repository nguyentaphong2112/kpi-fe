import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilIndexComponent } from '@app/modules/hrm/pages/personal-info/staff-info-layout/sil-index/sil-index.component';
import { SharedModule } from '@shared/shared.module';
import { HeaderInfoModule } from '@app/modules/hrm/pages/personal-info/header-info/header-info.module';
import { PersonalInfoModule } from '@app/modules/hrm/pages/personal-info/personal-info.module';
import { StaffInfoModule } from '@app/modules/hrm/pages/staff-info/staff-info.module';
import { StaffInfoLayoutRoutingModule } from './staff-info-layout.routing.module';

@NgModule({
  declarations: [SilIndexComponent],
  imports: [
    CommonModule,
    SharedModule,
    StaffInfoLayoutRoutingModule,
    PersonalInfoModule,
    HeaderInfoModule,
    StaffInfoModule
  ]
})
export class StaffInfoLayoutModule {
}
