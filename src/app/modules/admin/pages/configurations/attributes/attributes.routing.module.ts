import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttributeIndexComponent } from '@app/modules/admin/pages/configurations/attributes/attribute-index/attribute-index.component';

const routes: Routes = [
  {
    path: 'search',
    component: AttributeIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributesRoutingModule {
}
