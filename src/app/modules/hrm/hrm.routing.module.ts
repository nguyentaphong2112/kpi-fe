import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'log-task',
    loadChildren: () => import('./pages/log-task/log-task.module').then(m => m.LogTaskModule)
  },
  {
    path: 'model-plan',
    loadChildren: () => import('./pages/model-plan/model-plan.module').then(m => m.ModelPlanModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/category-manage/category-manage.module').then(m => m.CategoryManageModule)
  },
  {
    path: 'research',
    loadChildren: () => import('./pages/staff-research/staff-research.module').then(m => m.StaffResearchModule)
  },
  {
    path: 'staff',
    loadChildren: () => import('./pages/staff-info/staff-info.module').then(m => m.StaffInfoModule),
    data: {
      notShowPageName: true
    }
  },
  {
    path: 'personal',
    loadChildren: () => import('./pages/personal-info/personal-info.module').then(m => m.PersonalInfoModule),
    data: {
      notShowPageName: true
    }
  },
  {
    path: 'export-report',
    loadChildren: () => import('./pages/export-report/export-report.module').then(m => m.ExportReportModule)
  },
  {
    path: 'employee-directory',
    loadChildren: () => import('./pages/employee-directory/employee-directory.module').then(m => m.EmployeeDirectoryModule)
  },
  {
    path: 'salary-manager',
    loadChildren: () => import('./pages/salary-manager/salary-manager.module').then(m => m.SalaryManagerModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmRoutingModule {
}
