import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CtsIndexComponent } from '@app/modules/hrm/pages/category-manage/contract-types/cts-index/cts-index.component';

const routes: Routes = [
  {
    path: 'search',
    component: CtsIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractTypesRoutingModule {
}
