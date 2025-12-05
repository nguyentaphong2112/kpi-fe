import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { EmployeesIndexComponent } from '@app/modules/crm/pages/hrm-managers/employees/employees-index/employees-index.component';
import { EmployeesFormComponent } from '@app/modules/crm/pages/hrm-managers/employees/employees-form/employees-form.component';
import { EmployeesRoutingModule } from '@app/modules/crm/pages/hrm-managers/employees/employees.routing.module';
import { AttachmentsComponent } from './attachments/attachments.component';

export function declaration() {
  return [EmployeesIndexComponent, EmployeesFormComponent, AttachmentsComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, EmployeesRoutingModule]
})
export class EmployeesModule { }

