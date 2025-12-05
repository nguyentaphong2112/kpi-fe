import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'work-planning-templates',
    loadChildren: () => import('../kpi-templates/work-planning-templates/work-planning-templates.module').then(m => m.WorkPlanningTemplatesModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule { }
