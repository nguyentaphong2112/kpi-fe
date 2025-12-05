import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AwardInformationComponent } from '@app/modules/hrm/pages/personal-info/award-information/ain-index/award-information.component';

@NgModule({
  declarations: [AwardInformationComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AwardInformationModule {
}
