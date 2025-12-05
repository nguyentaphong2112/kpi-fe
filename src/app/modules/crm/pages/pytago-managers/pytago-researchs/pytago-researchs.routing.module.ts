import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PrsIndexComponent } from '@app/modules/crm/pages/pytago-managers/pytago-researchs/prs-index/prs-index.component';
import { PrsFormComponent } from '@app/modules/crm/pages/pytago-managers/pytago-researchs/prs-form/prs-form.component';


const routes: Routes = [
  {
    path: '',
    component: PrsIndexComponent
  },
  {
    path: 'form',
    component: PrsFormComponent,
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
export class PytagoResearchsRoutingModule {
}

