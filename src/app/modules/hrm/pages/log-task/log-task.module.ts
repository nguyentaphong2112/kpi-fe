import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogTaskIndexComponent } from '@app/modules/hrm/pages/log-task/log-task-index/log-task-index.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { LogTaskRoutingModule } from '@app/modules/hrm/pages/log-task/log-task.routing.module';
import { LogTaskFormComponent } from '@app/modules/hrm/pages/log-task/log-task-form/log-task-form.component';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [
    LogTaskFormComponent,
    LogTaskIndexComponent
  ],
  imports: [
    CommonModule,
    LogTaskRoutingModule,
    NzFormModule,
    FormsModule,
    NzGridModule,
    NzModalModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ],
  exports: [LogTaskIndexComponent]
})
export class LogTaskModule { }
