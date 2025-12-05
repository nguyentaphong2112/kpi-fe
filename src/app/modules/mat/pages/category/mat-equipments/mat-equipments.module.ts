import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {MesIndexComponent} from "@app/modules/mat/pages/category/mat-equipments/mes-index/mes-index.component";
import {MesFormComponent} from "@app/modules/mat/pages/category/mat-equipments/mes-form/mes-form.component";
import {MatEquipmentsRoutingModule} from "@app/modules/mat/pages/category/mat-equipments/mat-equipments.routing.module";

export function declaration() {
  return [MesIndexComponent, MesFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, MatEquipmentsRoutingModule]
})
export class MatEquipmentsModule { }

