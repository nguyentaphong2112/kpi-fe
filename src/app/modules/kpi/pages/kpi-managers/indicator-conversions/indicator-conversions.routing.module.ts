import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  IcsIndexComponent
} from '@app/modules/kpi/pages/kpi-managers/indicator-conversions/ics-index/ics-index.component';
import { IcsAddComponent } from '@app/modules/kpi/pages/kpi-managers/indicator-conversions/ics-add/ics-add.component';


const routes: Routes = [
  {
    path: '',
    component: IcsIndexComponent
  },
  {
    path: 'add-indicator-conversions',
    component: IcsAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicatorConversionsRoutingModule {
}

