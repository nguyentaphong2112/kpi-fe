import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ResourcesIndexComponent } from './resources-index/resources-index.component';

const routes: Routes = [
  {
    path: 'search',
    component: ResourcesIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule {
}
