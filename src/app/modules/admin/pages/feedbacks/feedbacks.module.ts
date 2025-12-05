import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackIndexComponent } from './feedback-index/feedback-index.component';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { FeedbacksRoutingModule } from '@app/modules/admin/pages/feedbacks/feedbacks.routing.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FeedbackDetailComponent } from '@app/modules/admin/pages/feedbacks/feedback-detail/feedback-detail.component';

@NgModule({
  declarations: [
    FeedbackIndexComponent,
    FeedbackFormComponent,
    FeedbackDetailComponent
  ],
  imports: [
    CommonModule,
    FeedbacksRoutingModule,
    NzFormModule,
    NzGridModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ]
})
export class FeedbacksModule { }
