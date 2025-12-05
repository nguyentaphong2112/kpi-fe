import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LogTaskIndexComponent } from '@app/modules/hrm/pages/log-task/log-task-index/log-task-index.component';

const routes: Routes = [
  {
    path: '',
    component: LogTaskIndexComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogTaskRoutingModule {
}
