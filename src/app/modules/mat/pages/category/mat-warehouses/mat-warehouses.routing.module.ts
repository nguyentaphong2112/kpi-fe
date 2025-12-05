import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MwsIndexComponent } from '@app/modules/mat/pages/category/mat-warehouses/mws-index/mws-index.component';
import { MwsFormComponent } from '@app/modules/mat/pages/category/mat-warehouses/mws-form/mws-form.component';


const routes: Routes = [
  {
    path: '',
    component: MwsIndexComponent
  },
  {
    path: 'form',
    component: MwsFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatWarehousesRoutingModule {
}

