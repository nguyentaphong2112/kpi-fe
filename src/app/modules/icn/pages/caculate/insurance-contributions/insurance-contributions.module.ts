import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {
  IcsIndexComponent
} from '@app/modules/icn/pages/caculate/insurance-contributions/ics-index/ics-index.component';
import { IcsFormComponent } from '@app/modules/icn/pages/caculate/insurance-contributions/ics-form/ics-form.component';
import {
  InsuranceContributionsRoutingModule
} from '@app/modules/icn/pages/caculate/insurance-contributions/insurance-contributions.routing.module';
import {
  ChangeListComponent
} from '@app/modules/icn/pages/caculate/insurance-contributions/change-list/change-list.component';
import {
  ArrearsPrePeriodViewComponent
} from '@app/modules/icn/pages/caculate/insurance-contributions/arrears-pre-period-view/arrears-pre-period-view.component';
import {
  ArrearsPreMedicalComponent
} from '@app/modules/icn/pages/caculate/insurance-contributions/arrears-pre-medical/arrears-pre-medical.component';
import {
  EmployeeInfoComponent
} from "@app/modules/icn/pages/caculate/insurance-contributions/employee-info/employee-info.component";
import {
  InfoIndexComponent
} from "@app/modules/icn/pages/caculate/insurance-contributions/info-index/info-index.component";
import {WorkInfoComponent} from "@app/modules/icn/pages/caculate/insurance-contributions/work-info/work-info.component";
import {
  StaffResearchCommonModule
} from "@app/modules/hrm/pages/staff-research/staff-research-common/staff-research-common.module";
import {
  ContractInfoComponent
} from "@app/modules/icn/pages/caculate/insurance-contributions/contract-info/contract-info.component";
import {IcInfoComponent} from "@app/modules/icn/pages/caculate/insurance-contributions/ic-info/ic-info.component";
import {
  AllowanceInfoComponent
} from "@app/modules/icn/pages/caculate/insurance-contributions/allowance-info/allowance-info.component";
import {
  DependentInfoComponent
} from "@app/modules/icn/pages/caculate/insurance-contributions/dependent-info/dependent-info.component";

export function declaration() {
  return [
    IcsIndexComponent,
    IcsFormComponent,
    ChangeListComponent,
    ArrearsPrePeriodViewComponent,
    ArrearsPreMedicalComponent,
    EmployeeInfoComponent,
    InfoIndexComponent,
    WorkInfoComponent,
    ContractInfoComponent,
    IcInfoComponent,
    AllowanceInfoComponent,
    DependentInfoComponent
  ];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, InsuranceContributionsRoutingModule, StaffResearchCommonModule]
})
export class InsuranceContributionsModule {
}

