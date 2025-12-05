import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CtsIndexComponent } from '@app/modules/admin/pages/categories/category-types/cts-index/cts-index.component';

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
export class CategoryTypesRoutingModule {
}
