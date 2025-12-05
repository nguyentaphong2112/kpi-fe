import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {QuestionsIndexComponent} from "@app/modules/exam/pages/question-manager/questions/questions-index/questions-index.component";
import {QuestionsFormComponent} from "@app/modules/exam/pages/question-manager/questions/questions-form/questions-form.component";
import {QuestionsRoutingModule} from "@app/modules/exam/pages/question-manager/questions/questions.routing.module";

export function declaration() {
  return [QuestionsIndexComponent, QuestionsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, QuestionsRoutingModule]
})
export class QuestionsModule { }

