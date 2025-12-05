import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'tax-settlement-masters',
    loadChildren: () => import('../settlement/tax-settlement-masters/tax-settlement-masters.module').then(m => m.TaxSettlementMastersModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettlementRoutingModule { }
