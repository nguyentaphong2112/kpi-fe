import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'tax-declare-masters',
    loadChildren: () => import('../declare/tax-declare-masters/tax-declare-masters.module').then(m => m.TaxDeclareMastersModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeclareRoutingModule { }
