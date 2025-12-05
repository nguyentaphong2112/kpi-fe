import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'category-sys',
    loadChildren: () => import('./category-system/category-system.module').then(m => m.CategorySystemModule)
  },
  {
    path: 'category-type',
    loadChildren: () => import('./category-types/category-types.module').then(m => m.CategoryTypesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {
}
