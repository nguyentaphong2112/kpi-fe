import {NgModule} from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {
  PartnersIndexComponent
} from "@app/modules/crm/pages/category-managers/partners/partners-index/partners-index.component";
import {
  PartnersFormComponent
} from "@app/modules/crm/pages/category-managers/partners/partners-form/partners-form.component";
import {PartnersRoutingModule} from "@app/modules/crm/pages/category-managers/partners/partners.routing.module";

export function declaration() {
  return [PartnersIndexComponent, PartnersFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, PartnersRoutingModule]
})
export class PartnersModule { }

