import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  WcsIndexComponent
} from "@app/modules/abs/pages/category-manager/work-calendars/wcs-index/wcs-index.component";

const routes: Routes = [{
  path: '',
  component: WcsIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkCalendarsRoutingModule {
}
