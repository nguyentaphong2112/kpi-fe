import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'emp-type',
    loadChildren: () => import('./emp-types/emp-types.module').then(m => m.EmpTypesModule)
  },
  {
    path: 'contract-type',
    loadChildren: () => import('./contract-types/contract-types.module').then(m => m.ContractTypesModule)
  },
  {
    path: 'document-type',
    loadChildren: () => import('./document-types/document-types.module').then(m => m.DocumentTypesModule)
  },
  {
    path: 'salary-ranks',
    loadChildren: () => import('./salary-ranks/salary-ranks.module').then(m => m.SalaryRanksModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryManageRoutingModule {
}
