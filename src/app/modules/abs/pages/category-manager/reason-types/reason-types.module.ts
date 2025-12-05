import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RtsIndexComponent } from '@app/modules/abs/pages/category-manager/reason-types/rts-index/rts-index.component';
import { RtsFormComponent } from '@app/modules/abs/pages/category-manager/reason-types/rts-form/rts-form.component';
import {
  ReasonTypesRoutingModule
} from '@app/modules/abs/pages/category-manager/reason-types/reason-types.routing.module';

export function declaration() {
  return [RtsIndexComponent, RtsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ReasonTypesRoutingModule]
})
export class ReasonTypesModule { }

