import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'mat-warehouses',
    loadChildren: () => import('../category/mat-warehouses/mat-warehouses.module').then(m => m.MatWarehousesModule)
  },
  {
    path: 'mat-equipments',
    loadChildren: () => import('../category/mat-equipments/mat-equipments.module').then(m => m.MatEquipmentsModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
