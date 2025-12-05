import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CtsIndexComponent } from '@app/modules/admin/pages/card-templates/cts-index/cts-index.component';

const routes: Routes = [
  {
    path: '',
    component: CtsIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardTemplatesRoutingModule {
}
