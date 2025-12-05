import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {RpmIndexComponent} from "@app/modules/lms/pages/research-managers/research-project-members/rpm-index/rpm-index.component";
import {RpmFormComponent} from "@app/modules/lms/pages/research-managers/research-project-members/rpm-form/rpm-form.component";
import {ResearchProjectMembersRoutingModule} from "@app/modules/lms/pages/research-managers/research-project-members/research-project-members.routing.module";

export function declaration() {
  return [RpmIndexComponent, RpmFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ResearchProjectMembersRoutingModule]
})
export class ResearchProjectMembersModule { }

