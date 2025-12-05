import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrganizationsLayoutComponent } from '@app/modules/hrm/pages/model-plan/organizations/organizations-layout/organizations-layout.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationsLayoutComponent,
    data: {
      notShowPageName: true
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationsRoutingModule {
}
