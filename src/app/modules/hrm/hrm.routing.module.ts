import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'model-plan',
    loadChildren: () => import('./pages/model-plan/model-plan.module').then(m => m.ModelPlanModule)
  },
  {
    path: 'research',
    loadChildren: () => import('./pages/staff-research/staff-research.module').then(m => m.StaffResearchModule)
  },
  {
    path: 'staff',
    loadChildren: () => import('./pages/staff-info/staff-info.module').then(m => m.StaffInfoModule),
    data: {
      notShowPageName: true
    }
  },
  {
    path: 'personal',
    loadChildren: () => import('./pages/personal-info/personal-info.module').then(m => m.PersonalInfoModule),
    data: {
      notShowPageName: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmRoutingModule {
}
