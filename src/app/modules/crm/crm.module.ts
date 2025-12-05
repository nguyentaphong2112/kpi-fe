import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutingModule } from '@app/modules/crm/crm.routing.module';
import { PrintFormComponent } from './ui/print-form/print-form.component';
import { SharedModule } from '../../shared/shared.module';
import { LogActionComponent } from './ui/log-action/log-action.component';
import {LogActionFormComponent} from "@app/modules/crm/ui/log-action-form/log-action-form.component";

@NgModule({
  declarations: [PrintFormComponent, LogActionComponent, LogActionFormComponent],
  imports: [CommonModule, SharedModule, RoutingModule]
})
export class CrmModule {}

