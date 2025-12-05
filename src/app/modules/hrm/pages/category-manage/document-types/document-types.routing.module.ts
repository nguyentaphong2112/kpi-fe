import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DtsIndexComponent } from '@app/modules/hrm/pages/category-manage/document-types/dts-index/dts-index.component';

const routes: Routes = [
  {
    path: 'search',
    component: DtsIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentTypesRoutingModule {
}
