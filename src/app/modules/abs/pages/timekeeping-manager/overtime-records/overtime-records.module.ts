import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {OrsIndexComponent} from "@app/modules/abs/pages/timekeeping-manager/overtime-records/ors-index/ors-index.component";
import {OrsFormComponent} from "@app/modules/abs/pages/timekeeping-manager/overtime-records/ors-form/ors-form.component";
import {OvertimeRecordsRoutingModule} from "@app/modules/abs/pages/timekeeping-manager/overtime-records/overtime-records.routing.module";

export function declaration() {
  return [OrsIndexComponent, OrsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, OvertimeRecordsRoutingModule]
})
export class OvertimeRecordsModule { }

