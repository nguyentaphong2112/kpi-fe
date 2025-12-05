import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'income-item-masters',
    loadChildren: () => import('../income/income-item-masters/income-item-masters.module').then(m => m.IncomeItemMastersModule)
  },
  {
    path: 'income-items',
    loadChildren: () => import('../income/income-items/income-items.module').then(m => m.IncomeItemsModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeRoutingModule { }
