import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SrsIndexComponent } from '@app/modules/hrm/pages/category-manage/salary-ranks/srs-index/srs-index.component';

const routes: Routes = [{
  path: 'search',
  component: SrsIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryRanksRoutingModule {
}
