import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  IndicatorsIndexComponent
} from '@app/modules/kpi/pages/kpi-managers/indicators/indicators-index/indicators-index.component';


const routes: Routes = [
  {
    path: '',
    component: IndicatorsIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicatorsRoutingModule {
}

