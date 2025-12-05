import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'personal-info',
    loadChildren: () => import('./staff-info-layout/staff-info-layout.module').then(m => m.StaffInfoLayoutModule)
  },
  {
    path: 'health-records',
    loadChildren: () => import('../staff-info/health-records/health-records.module').then(m => m.HealthRecordsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffInfoRoutingModule {
}
