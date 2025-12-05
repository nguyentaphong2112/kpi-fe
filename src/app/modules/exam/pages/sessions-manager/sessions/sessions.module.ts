import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {
  SessionsIndexComponent
} from '@app/modules/exam/pages/sessions-manager/sessions/sessions-index/sessions-index.component';
import {
  SessionsFormComponent
} from '@app/modules/exam/pages/sessions-manager/sessions/sessions-form/sessions-form.component';
import { SessionsRoutingModule } from '@app/modules/exam/pages/sessions-manager/sessions/sessions.routing.module';
import {
  InfoFormComponent
} from '@app/modules/exam/pages/sessions-manager/sessions/sessions-form/info-form/info-form.component';
import {
  TimeFormComponent
} from '@app/modules/exam/pages/sessions-manager/sessions/sessions-form/time-form/time-form.component';
import {
  RuleFormComponent
} from '@app/modules/exam/pages/sessions-manager/sessions/sessions-form/rule-form/rule-form.component';
import {
  AfterSubmitFormComponent
} from '@app/modules/exam/pages/sessions-manager/sessions/sessions-form/after-submit-form/after-submit-form.component';
import {
  ParticipantFormComponent
} from '@app/modules/exam/pages/sessions-manager/sessions/sessions-form/participant-form/participant-form.component';

export function declaration() {
  return [SessionsIndexComponent, SessionsFormComponent, InfoFormComponent, TimeFormComponent, RuleFormComponent, AfterSubmitFormComponent, ParticipantFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, SessionsRoutingModule]
})
export class SessionsModule { }

