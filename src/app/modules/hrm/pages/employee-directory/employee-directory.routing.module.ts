import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EdyIndexComponent } from '@app/modules/hrm/pages/employee-directory/edy-index/edy-index.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: EdyIndexComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeDirectoryRoutingModule {
}
