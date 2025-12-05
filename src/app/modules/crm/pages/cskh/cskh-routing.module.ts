import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CskhIndexComponent } from '@app/modules/crm/pages/cskh/cskh-index/cskh-index.component';

const routes: Routes = [
  {
    path: '',
    component: CskhIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CskhRoutingModule { }
