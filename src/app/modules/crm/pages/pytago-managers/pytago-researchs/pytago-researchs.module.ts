import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import {
  PrsIndexComponent
} from '@app/modules/crm/pages/pytago-managers/pytago-researchs/prs-index/prs-index.component';
import { PrsFormComponent } from '@app/modules/crm/pages/pytago-managers/pytago-researchs/prs-form/prs-form.component';
import {
  PytagoResearchsRoutingModule
} from '@app/modules/crm/pages/pytago-managers/pytago-researchs/pytago-researchs.routing.module';
import { NgOptimizedImage } from '@angular/common';
import { PytagoModule } from '@app/modules/crm/pages/pytago-managers/pytago/pytago.module';

export function declaration() {
  return [PrsIndexComponent, PrsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, PytagoResearchsRoutingModule, NgOptimizedImage, PytagoModule]
})
export class PytagoResearchsModule {
}

