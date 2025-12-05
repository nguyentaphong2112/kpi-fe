import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {
  IcsIndexComponent
} from '@app/modules/kpi/pages/kpi-managers/indicator-conversions/ics-index/ics-index.component';
import {
  IcsFormComponent
} from '@app/modules/kpi/pages/kpi-managers/indicator-conversions/ics-form/ics-form.component';
import {
  IndicatorConversionsRoutingModule
} from '@app/modules/kpi/pages/kpi-managers/indicator-conversions/indicator-conversions.routing.module';
import {
  IcsAddComponent
} from '@app/modules/kpi/pages/kpi-managers/indicator-conversions/ics-add/ics-add.component';
import {
  IcsAddFormComponent
} from '@app/modules/kpi/pages/kpi-managers/indicator-conversions/ics-add-form/ics-add-form.component';

export function declaration() {
  return [IcsIndexComponent, IcsFormComponent, IcsAddComponent, IcsAddFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, IndicatorConversionsRoutingModule]
})
export class IndicatorConversionsModule {
}

