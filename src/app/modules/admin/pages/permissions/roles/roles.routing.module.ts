import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesIndexComponent } from './roles-index/roles-index.component';

const routes: Routes = [
  {
    path: 'search',
    component: RolesIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {
}
