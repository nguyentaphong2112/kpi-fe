import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'tax-commitments',
    loadChildren: () => import('../commitments/tax-commitments/tax-commitments.module').then(m => m.TaxCommitmentsModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommitmentsRoutingModule { }
