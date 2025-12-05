import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FunctionCode, MODULE_CODE } from '@shared/enums/enums-constant';

const routes: Routes = [
  {
    path: 'income',
    loadChildren: () => import('./pages/income/income.module').then(m => m.IncomeModule)
  },
  {
    path: 'commitments',
    loadChildren: () => import('./pages/commitments/commitments.module').then(m => m.CommitmentsModule)
  },
  {
    path: 'declare',
    loadChildren: () => import('./pages/declare/declare.module').then(m => m.DeclareModule)
  },
  {
    path: 'settlement',
    loadChildren: () => import('./pages/settlement/settlement.module').then(m => m.SettlementModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./pages/report/report.module').then(m => m.ReportModule)
  },
  {
    path: 'configurations',
    loadChildren: () => import('../admin/pages/configurations/configurations.module').then(m => m.ConfigurationsModule),
    data: {
      functionCode: FunctionCode.PIT_CONFIG_PARAMETER,
      moduleCode: MODULE_CODE.PIT_INCOME
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule {
}
