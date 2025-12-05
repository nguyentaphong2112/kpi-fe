import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WinComponent } from '@app/modules/hrm/pages/staff-info/work-information/win-index/win.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [WinComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class WorkInformationModule {
}
