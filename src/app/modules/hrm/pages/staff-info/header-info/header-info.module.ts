import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderInfoComponent } from '@app/modules/hrm/pages/staff-info/header-info/hin-index/header-info.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [HeaderInfoComponent],
  exports: [
    HeaderInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HeaderInfoModule {
}
