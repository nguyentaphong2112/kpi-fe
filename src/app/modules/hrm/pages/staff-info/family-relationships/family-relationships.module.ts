import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrsIndexComponent } from '@app/modules/hrm/pages/staff-info/family-relationships/frs-index/frs-index.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [FrsIndexComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class FamilyRelationshipsModule {
}
