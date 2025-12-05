import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'mat-inventory-adjustments',
    loadChildren: () => import('../inventory/mat-inventory-adjustments/mat-inventory-adjustments.module').then(m => m.MatInventoryAdjustmentsModule)
  },
  {
    path: 'mat-outgoing-shipments',
    loadChildren: () => import('../inventory/mat-outgoing-shipments/mat-outgoing-shipments.module').then(m => m.MatOutgoingShipmentsModule)
  },
  {
    path: 'mat-transferring-shipments',
    loadChildren: () => import('../inventory/mat-transferring-shipments/mat-transferring-shipments.module').then(m => m.MatTransferringShipmentsModule)
  },
  {
    path: 'mat-incoming-shipments',
    loadChildren: () => import('../inventory/mat-incoming-shipments/mat-incoming-shipments.module').then(m => m.MatIncomingShipmentsModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
