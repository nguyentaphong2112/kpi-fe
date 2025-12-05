import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {IsdIndexComponent} from "@app/modules/lms/pages/internship-managers/internship-session-details/isd-index/isd-index.component";
import {IsdFormComponent} from "@app/modules/lms/pages/internship-managers/internship-session-details/isd-form/isd-form.component";
import {InternshipSessionDetailsRoutingModule} from "@app/modules/lms/pages/internship-managers/internship-session-details/internship-session-details.routing.module";

export function declaration() {
  return [IsdIndexComponent, IsdFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, InternshipSessionDetailsRoutingModule]
})
export class InternshipSessionDetailsModule { }

