import { NgModule } from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {RpsIndexComponent} from '@app/modules/lms/pages/research-managers/research-projects/rps-index/rps-index.component';
import {RpsFormComponent} from '@app/modules/lms/pages/research-managers/research-projects/rps-form/rps-form.component';
import {ResearchProjectsRoutingModule} from '@app/modules/lms/pages/research-managers/research-projects/research-projects.routing.module';

export function declaration() {
  return [RpsIndexComponent, RpsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ResearchProjectsRoutingModule]
})
export class ResearchProjectsModule { }

