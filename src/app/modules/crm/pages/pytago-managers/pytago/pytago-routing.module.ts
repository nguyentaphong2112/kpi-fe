import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PtoIndexComponent } from '@app/modules/crm/pages/pytago-managers/pytago/pto-index/pto-index.component';

const routes: Routes = [
  {
    path: '',
    component: PtoIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PytagoRoutingModule { }
