import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsFormComponent } from '@app/modules/hrm/pages/model-plan/jobs/jobs-form/jobs-form.component';
import { JobsIndexComponent } from '@app/modules/hrm/pages/model-plan/jobs/jobs-index/jobs-index.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { JobsRoutingModule } from '@app/modules/hrm/pages/model-plan/jobs/jobs.routing.module';

@NgModule({
  declarations: [
    JobsFormComponent,
    JobsIndexComponent,
  ],
  imports: [
    CommonModule,
    JobsRoutingModule,
    FormsModule,
    SharedModule,
  ]
})
export class JobsModule { }
