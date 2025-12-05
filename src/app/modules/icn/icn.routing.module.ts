import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FunctionCode, MODULE_CODE } from '@shared/enums/enums-constant';

const routes: Routes = [
  {
    path: 'configs',
    loadChildren: () => import('./pages/configs/configs.module').then(m => m.ConfigsModule)
  },
  {
    path: 'caculate',
    loadChildren: () => import('./pages/caculate/caculate.module').then(m => m.CaculateModule)
  },
  {
    path: 'configurations',
    loadChildren: () => import('../admin/pages/configurations/configurations.module').then(m => m.ConfigurationsModule),
    data: {
      functionCode: FunctionCode.ICN_CONFIG_PARAMETER,
      moduleCode: MODULE_CODE.INSURANCE_CONTRIBUTION
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule {
}
