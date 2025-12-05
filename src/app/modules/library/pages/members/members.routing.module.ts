import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberIndexComponent } from '@app/modules/library/pages/members/member-index/member-index.component';

const routes: Routes = [
  {
    path: '',
    component: MemberIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
