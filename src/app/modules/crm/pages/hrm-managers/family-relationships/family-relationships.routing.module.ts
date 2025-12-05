import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FrsIndexComponent } from '@app/modules/crm/pages/hrm-managers/family-relationships/frs-index/frs-index.component';
import { FrsFormComponent } from '@app/modules/crm/pages/hrm-managers/family-relationships/frs-form/frs-form.component';


const routes: Routes = [
  {
    path: '',
    component: FrsIndexComponent
  },
  {
    path: 'form',
    component: FrsFormComponent,
    data: {
      isShowBackBtn: true,
      pageName: 'Thêm mới',
      breadcrumb: 'Thêm mới'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamilyRelationshipsRoutingModule {
}

