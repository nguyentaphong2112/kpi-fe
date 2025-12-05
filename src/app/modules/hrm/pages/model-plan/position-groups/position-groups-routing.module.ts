import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PgsIndexComponent } from '@app/modules/hrm/pages/model-plan/position-groups/pgs-index/pgs-index.component';

const routes: Routes = [{
  path: 'search',
  component: PgsIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionGroupsRoutingModule {
}
