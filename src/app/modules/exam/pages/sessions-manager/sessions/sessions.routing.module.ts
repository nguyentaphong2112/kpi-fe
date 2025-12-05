import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  SessionsIndexComponent
} from '@app/modules/exam/pages/sessions-manager/sessions/sessions-index/sessions-index.component';
import {
  SessionsFormComponent
} from '@app/modules/exam/pages/sessions-manager/sessions/sessions-form/sessions-form.component';


const routes: Routes = [
  {
    path: '',
    component: SessionsIndexComponent
  },
  {
    path: 'form',
    component: SessionsFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionsRoutingModule {
}

