import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SilIndexComponent } from '@app/modules/hrm/pages/staff-info/staff-info-layout/sil-index/sil-index.component';

const routes: Routes = [{
  path: '',
  component: SilIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffInfoLayoutRoutingModule {
}
