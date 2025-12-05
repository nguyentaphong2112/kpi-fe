import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDirectoryRoutingModule } from '@app/modules/hrm/pages/employee-directory/employee-directory.routing.module';
import { EdyIndexComponent } from '@app/modules/hrm/pages/employee-directory/edy-index/edy-index.component';
import { EdyCardComponent } from '@app/modules/hrm/pages/employee-directory/edy-card/edy-card.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [EdyIndexComponent, EdyCardComponent],
  imports: [
    CommonModule,
    EmployeeDirectoryRoutingModule,
    SharedModule
  ]
})
export class EmployeeDirectoryModule { }
