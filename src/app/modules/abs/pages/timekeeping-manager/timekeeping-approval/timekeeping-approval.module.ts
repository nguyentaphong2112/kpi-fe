import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimekeepingApprovalRoutingModule } from './timekeeping-approval-routing.module';
import { TalIndexComponent } from './tal-index/tal-index.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzTransitionPatchModule} from "ng-zorro-antd/core/transition-patch/transition-patch.module";
import {SharedModule} from "@shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {
  AhsIndexComponent
} from "@app/modules/abs/pages/timekeeping-manager/attendance-histories/ahs-index/ahs-index.component";
import {
  AhsFormComponent
} from "@app/modules/abs/pages/timekeeping-manager/attendance-histories/ahs-form/ahs-form.component";
import {
  AttendanceHistoriesRoutingModule
} from "@app/modules/abs/pages/timekeeping-manager/attendance-histories/attendance-histories.routing.module";


export function declaration() {
  return [TalIndexComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, TimekeepingApprovalRoutingModule]
})
export class TimekeepingApprovalModule { }
