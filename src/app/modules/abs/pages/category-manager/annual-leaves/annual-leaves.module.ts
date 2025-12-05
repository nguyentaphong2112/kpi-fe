import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AlsIndexComponent } from '@app/modules/abs/pages/category-manager/annual-leaves/als-index/als-index.component';
import { AlsFormComponent } from '@app/modules/abs/pages/category-manager/annual-leaves/als-form/als-form.component';
import {
  AnnualLeavesRoutingModule
} from '@app/modules/abs/pages/category-manager/annual-leaves/annual-leaves.routing.module';

export function declaration() {
  return [AlsIndexComponent, AlsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, AnnualLeavesRoutingModule]
})
export class AnnualLeavesModule { }

