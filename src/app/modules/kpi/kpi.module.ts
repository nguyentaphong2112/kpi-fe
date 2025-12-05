import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpiRoutingModule } from '@app/modules/kpi/kpi.routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule, KpiRoutingModule]
})
export class KpiModule {
}

