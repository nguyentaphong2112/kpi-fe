import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'reason-types',
    loadChildren: () => import('../category-manager/reason-types/reason-types.module').then(m => m.ReasonTypesModule)
  },
  {
    path: 'workday-types',
    loadChildren: () => import('../category-manager/workday-types/workday-types.module').then(m => m.WorkdayTypesModule)
  },
  {
    path: 'work-calendars',
    loadChildren: () => import('@app/modules/abs/pages/category-manager/work-calendars/work-calendars.module').then(m => m.WorkCalendarsModule)
  },
  {
    path: 'annual-leaves',
    loadChildren: () => import('../category-manager/annual-leaves/annual-leaves.module').then(m => m.AnnualLeavesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryManagerRoutingModule { }
