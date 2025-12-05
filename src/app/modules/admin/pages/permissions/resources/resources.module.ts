import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ResourcesRoutingModule } from '@app/modules/admin/pages/permissions/resources/resources.routing.module';
import { ResourcesFormComponent } from './resources-form/resources-form.component';
import { ResourcesIndexComponent } from './resources-index/resources-index.component';

export function declaration() {
  return [ResourcesIndexComponent, ResourcesFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ResourcesRoutingModule]
})
export class ResourcesModule {
}
