import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FeedbackIndexComponent } from '@app/modules/admin/pages/feedbacks/feedback-index/feedback-index.component';

const routes: Routes = [
  {
    path: '',
    component: FeedbackIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbacksRoutingModule {
}
