import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'salary-reviews',
    loadChildren: () => import('../salary-manager/salary-reviews/salary-reviews.module').then(m => m.SalaryReviewsModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryManagerRoutingModule { }
