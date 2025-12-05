import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'books',
    loadChildren: () => import('./pages/books/books.module').then(m => m.BooksModule)
  },
  {
    path: 'members',
    loadChildren: () => import('./pages/members/members.module').then(m => m.MembersModule)
  },
  {
    path: 'book-loans',
    loadChildren: () => import('@app/modules/library/pages/book-loans/book-loans.module').then(m => m.BookLoansModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule {
}
