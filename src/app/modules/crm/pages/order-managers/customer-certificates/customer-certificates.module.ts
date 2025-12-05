import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {CcsIndexComponent} from "@app/modules/crm/pages/order-managers/customer-certificates/ccs-index/ccs-index.component";
import {CcsFormComponent} from "@app/modules/crm/pages/order-managers/customer-certificates/ccs-form/ccs-form.component";
import {CustomerCertificatesRoutingModule} from "@app/modules/crm/pages/order-managers/customer-certificates/customer-certificates.routing.module";

export function declaration() {
  return [CcsIndexComponent, CcsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, CustomerCertificatesRoutingModule]
})
export class CustomerCertificatesModule { }

