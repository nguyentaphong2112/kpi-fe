import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { QuestionsIndexComponent } from '@app/modules/exam/pages/question-manager/questions/questions-index/questions-index.component';
import { QuestionsFormComponent } from '@app/modules/exam/pages/question-manager/questions/questions-form/questions-form.component';


const routes: Routes = [
  {
    path: '',
    component: QuestionsIndexComponent
  },
  {
    path: 'form',
    component: QuestionsFormComponent,
    data: {
      isShowBackBtn: true,
      pageName: 'Thêm mới',
      breadcrumb: 'Thêm mới'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule {
}

