import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FunctionCode } from '@shared/enums/enums-constant';
import { MICRO_SERVICE } from '@core/constant/system.constants';

const routes: Routes = [
  {
    path: 'permission',
    loadChildren: () => import('./pages/permissions/permissions.module').then(m => m.PermissionsModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
