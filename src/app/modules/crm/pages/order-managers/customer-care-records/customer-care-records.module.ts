import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {CcrIndexComponent} from "@app/modules/crm/pages/order-managers/customer-care-records/ccr-index/ccr-index.component";
import {CcrFormComponent} from "@app/modules/crm/pages/order-managers/customer-care-records/ccr-form/ccr-form.component";
import {CustomerCareRecordsRoutingModule} from "@app/modules/crm/pages/order-managers/customer-care-records/customer-care-records.routing.module";

export function declaration() {
  return [CcrIndexComponent, CcrFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, CustomerCareRecordsRoutingModule]
})
export class CustomerCareRecordsModule { }

