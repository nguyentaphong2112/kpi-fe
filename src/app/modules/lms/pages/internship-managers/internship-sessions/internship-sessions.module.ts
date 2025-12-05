import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {IssIndexComponent} from "@app/modules/lms/pages/internship-managers/internship-sessions/iss-index/iss-index.component";
import {IssFormComponent} from "@app/modules/lms/pages/internship-managers/internship-sessions/iss-form/iss-form.component";
import {InternshipSessionsRoutingModule} from "@app/modules/lms/pages/internship-managers/internship-sessions/internship-sessions.routing.module";

export function declaration() {
  return [IssIndexComponent, IssFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, InternshipSessionsRoutingModule]
})
export class InternshipSessionsModule { }

