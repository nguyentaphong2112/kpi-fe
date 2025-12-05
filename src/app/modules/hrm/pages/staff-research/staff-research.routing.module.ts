import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'basics',
    pathMatch: 'full'
  },
  {
    path: 'basics',
    loadChildren: () => import('../staff-research/basic/basic.module').then(m => m.BasicModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffResearchRoutingModule {
}
