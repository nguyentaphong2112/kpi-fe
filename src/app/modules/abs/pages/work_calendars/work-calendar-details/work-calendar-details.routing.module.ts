import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { WcdIndexComponent } from '@app/modules/abs/pages/work_calendars/work-calendar-details/wcd-index/wcd-index.component';
import { WcdFormComponent } from '@app/modules/abs/pages/work_calendars/work-calendar-details/wcd-form/wcd-form.component';


const routes: Routes = [
  {
    path: '',
    component: WcdIndexComponent
  },
  {
    path: 'form',
    component: WcdFormComponent,
    data: {
      isShowBackBtn: true,
      pageName: 'thêm mới',
      breadcrumb: 'thêm mới'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkCalendarDetailsRoutingModule {
}

