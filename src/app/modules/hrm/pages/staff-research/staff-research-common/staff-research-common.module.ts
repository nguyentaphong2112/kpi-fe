import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { SearchFormCommonModule } from '@app/modules/hrm/pages/staff-research/search-form-common/search-form-common.module';
import { SrcIndexComponent } from './src-index/src-index.component';

@NgModule({
  declarations: [
    SrcIndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SearchFormCommonModule
  ],
  exports: [SrcIndexComponent]
})
export class StaffResearchCommonModule { }
