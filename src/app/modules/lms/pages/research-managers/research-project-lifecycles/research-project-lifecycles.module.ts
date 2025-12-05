import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {RplIndexComponent} from "@app/modules/lms/pages/research-managers/research-project-lifecycles/rpl-index/rpl-index.component";
import {RplFormComponent} from "@app/modules/lms/pages/research-managers/research-project-lifecycles/rpl-form/rpl-form.component";
import {ResearchProjectLifecyclesRoutingModule} from "@app/modules/lms/pages/research-managers/research-project-lifecycles/research-project-lifecycles.routing.module";

export function declaration() {
  return [RplIndexComponent, RplFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ResearchProjectLifecyclesRoutingModule]
})
export class ResearchProjectLifecyclesModule { }

