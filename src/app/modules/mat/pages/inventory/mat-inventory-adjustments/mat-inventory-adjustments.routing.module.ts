import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MiaIndexComponent } from '@app/modules/mat/pages/inventory/mat-inventory-adjustments/mia-index/mia-index.component';
import { MiaFormComponent } from '@app/modules/mat/pages/inventory/mat-inventory-adjustments/mia-form/mia-form.component';


const routes: Routes = [
  {
    path: '',
    component: MiaIndexComponent
  },
  {
    path: 'form',
    component: MiaFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatInventoryAdjustmentsRoutingModule {
}

