import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'timekeepings',
    loadChildren: () => import('../timekeeping-manager/timekeepings/timekeepings.module').then(m => m.TimekeepingsModule)
  },
  {
    path: 'timekeeping-overtime',
    loadChildren: () => import('../timekeeping-manager/timekeeping-overtime/timekeeping-overtime.module').then(m => m.TimekeepingOvertimeModule)
  },
  {
    path: 'overtime-records',
    loadChildren: () => import('../timekeeping-manager/overtime-records/overtime-records.module').then(m => m.OvertimeRecordsModule)
  },
  {
    path: 'attendance-histories',
    loadChildren: () => import('../timekeeping-manager/attendance-histories/attendance-histories.module').then(m => m.AttendanceHistoriesModule)
  },
  {
    path: 'timekeeping-approval',
    loadChildren: () => import('../timekeeping-manager/timekeeping-approval/timekeeping-approval.module').then(m => m.TimekeepingApprovalModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimekeepingManagerRoutingModule { }
