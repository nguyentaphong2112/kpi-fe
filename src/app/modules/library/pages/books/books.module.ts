import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksRoutingModule } from '@app/modules/library/pages/books/books.routing.module';
import { BookIndexComponent } from '@app/modules/library/pages/books/book-index/book-index.component';
import { SharedModule } from '@shared/shared.module';
import { BookLayoutComponent } from '@app/modules/library/pages/books/book-layout/book-layout.component';
import { BookFormComponent } from '@app/modules/library/pages/books/book-form/book-form.component';
import { BookEditionFormComponent } from '@app/modules/library/pages/books/book-edition-form/book-edition-form.component';
import { BookDetailComponent } from '@app/modules/library/pages/books/book-detail/book-detail.component';
import { BookDetailFormComponent } from '@app/modules/library/pages/books/book-detail-form/book-detail-form.component';
import { BookCategoryComponent } from '@app/modules/library/pages/books/book-category/book-category.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [BookIndexComponent, BookLayoutComponent, BookFormComponent, BookEditionFormComponent, BookDetailComponent,
    BookDetailFormComponent, BookCategoryComponent],
  imports: [
    CommonModule,
    BooksRoutingModule,
    SharedModule,
    PdfViewerModule
  ]
})
export class BooksModule {
}
