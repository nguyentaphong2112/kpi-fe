import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'research-project-members',
    loadChildren: () => import('../research-managers/research-project-members/research-project-members.module').then(m => m.ResearchProjectMembersModule)
  },
  {
    path: 'research-project-lifecycles',
    loadChildren: () => import('../research-managers/research-project-lifecycles/research-project-lifecycles.module').then(m => m.ResearchProjectLifecyclesModule)
  },
  {
    path: 'research-projects',
    loadChildren: () => import('../research-managers/research-projects/research-projects.module').then(m => m.ResearchProjectsModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResearchManagersRoutingModule { }
