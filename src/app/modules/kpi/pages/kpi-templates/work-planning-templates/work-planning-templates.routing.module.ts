import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { WptIndexComponent } from '@app/modules/kpi/pages/kpi-templates/work-planning-templates/wpt-index/wpt-index.component';
import { WptFormComponent } from '@app/modules/kpi/pages/kpi-templates/work-planning-templates/wpt-form/wpt-form.component';


const routes: Routes = [
  {
    path: '',
    component: WptIndexComponent
  },
  {
    path: 'form',
    component: WptFormComponent,
    data: {
      isShowBackBtn: true,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkPlanningTemplatesRoutingModule {
}

