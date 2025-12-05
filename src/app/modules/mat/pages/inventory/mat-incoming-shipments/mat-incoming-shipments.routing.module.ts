import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MisIndexComponent } from '@app/modules/mat/pages/inventory/mat-incoming-shipments/mis-index/mis-index.component';
import { MisFormComponent } from '@app/modules/mat/pages/inventory/mat-incoming-shipments/mis-form/mis-form.component';


const routes: Routes = [
  {
    path: '',
    component: MisIndexComponent
  },
  {
    path: 'form',
    component: MisFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatIncomingShipmentsRoutingModule {
}

