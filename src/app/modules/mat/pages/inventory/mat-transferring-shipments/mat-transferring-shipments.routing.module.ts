import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MtsIndexComponent } from '@app/modules/mat/pages/inventory/mat-transferring-shipments/mts-index/mts-index.component';
import { MtsFormComponent } from '@app/modules/mat/pages/inventory/mat-transferring-shipments/mts-form/mts-form.component';


const routes: Routes = [
  {
    path: '',
    component: MtsIndexComponent
  },
  {
    path: 'form',
    component: MtsFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatTransferringShipmentsRoutingModule {
}

