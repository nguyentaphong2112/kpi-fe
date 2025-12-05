import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  BookLoansIndexComponent
} from '@app/modules/library/pages/book-loans/book-loans-index/book-loans-index.component';

const routes: Routes = [{
  path: '',
  component: BookLoansIndexComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookLoansRoutingModule {
}
