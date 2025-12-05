import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { WcsIndexComponent } from '@app/modules/abs/pages/work_calendars/work-calendars/wcs-index/wcs-index.component';
import { WcsFormComponent } from '@app/modules/abs/pages/work_calendars/work-calendars/wcs-form/wcs-form.component';


const routes: Routes = [
  {
    path: '',
    component: WcsIndexComponent
  },
  {
    path: 'form',
    component: WcsFormComponent,
    data: {
      isShowBackBtn: true,
      pageName: 'Thêm mới',
      breadcrumb: 'Thêm mới'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkCalendarsRoutingModule {
}

