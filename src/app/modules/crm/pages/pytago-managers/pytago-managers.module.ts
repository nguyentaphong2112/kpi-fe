import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PytagoManagersRoutingModule } from '@app/modules/crm/pages/pytago-managers/pytago-managers.routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, PytagoManagersRoutingModule]
})
export class PytagoManagersModule {}

