import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CsmIndexComponent } from './csm-index/csm-index.component';

const routes: Routes = [
  {
    path: 'search',
    component: CsmIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategorySystemRoutingModule {
}
