import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamRoutingModule } from '@app/modules/exam/exam.routing.module';

@NgModule({
  imports: [CommonModule, ExamRoutingModule]
})
export class ExamModule {}

