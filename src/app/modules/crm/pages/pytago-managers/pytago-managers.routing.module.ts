import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PytagoModule } from '@app/modules/crm/pages/pytago-managers/pytago/pytago.module';

const routes: Routes = [
    {
    path: 'pytago-values',
    loadChildren: () => import('../pytago-managers/pytago-values/pytago-values.module').then(m => m.PytagoValuesModule)
  },
  {
    path: 'pytago-researchs',
    loadChildren: () => import('../pytago-managers/pytago-researchs/pytago-researchs.module').then(m => m.PytagoResearchsModule)
  },
  {
    path: 'pytago',
    loadChildren: () => import('../pytago-managers/pytago/pytago.module').then(m => m.PytagoModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PytagoManagersRoutingModule { }
