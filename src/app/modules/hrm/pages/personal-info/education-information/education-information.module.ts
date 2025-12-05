import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationInformationComponent } from '@app/modules/hrm/pages/personal-info/education-information/ein-index/education-information.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [EducationInformationComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class EducationInformationModule {
}
