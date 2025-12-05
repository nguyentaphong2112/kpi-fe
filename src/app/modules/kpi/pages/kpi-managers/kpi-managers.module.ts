import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ManagersRoutingModule } from '@app/modules/kpi/pages/kpi-managers/kpi-managers.routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, ManagersRoutingModule]
})
export class KpiManagersModule {}
