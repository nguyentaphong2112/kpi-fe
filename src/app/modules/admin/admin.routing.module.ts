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
  {
    path: 'configurations',
    data: {
      functionCode: FunctionCode.SYS_CONFIG_PARAMETER,
      moduleCode: MICRO_SERVICE.ADMIN
    },
    loadChildren: () => import('./pages/configurations/configurations.module').then(m => m.ConfigurationsModule)
  },
  {
    path: 'card-templates',
    loadChildren: () => import('./pages/card-templates/card-templates.module').then(m => m.CardTemplatesModule)
  },
  {
    path: 'feedbacks',
    loadChildren: () => import('./pages/feedbacks/feedbacks.module').then(m => m.FeedbacksModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
