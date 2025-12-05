import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtsIndexComponent } from '@app/modules/hrm/pages/category-manage/emp-types/ets-index/ets-index.component';

const routes: Routes = [
  {
    path: 'search',
    component: EtsIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpTypesRoutingModule {
}
