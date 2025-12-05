import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MesIndexComponent } from '@app/modules/mat/pages/category/mat-equipments/mes-index/mes-index.component';
import { MesFormComponent } from '@app/modules/mat/pages/category/mat-equipments/mes-form/mes-form.component';


const routes: Routes = [
  {
    path: '',
    component: MesIndexComponent
  },
  {
    path: 'form',
    component: MesFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatEquipmentsRoutingModule {
}

