import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BookLayoutComponent } from '@app/modules/library/pages/books/book-layout/book-layout.component';
import { BookFormComponent } from '@app/modules/library/pages/books/book-form/book-form.component';
import { BookDetailComponent } from '@app/modules/library/pages/books/book-detail/book-detail.component';

const routes: Routes = [
  {
    path: '',
    component: BookLayoutComponent
  },
  {
    path: 'add-book',
    component: BookFormComponent
  },
  {
    path: 'edit-book',
    component: BookFormComponent
  },
  {
    path: 'detail',
    component: BookDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule {
}
