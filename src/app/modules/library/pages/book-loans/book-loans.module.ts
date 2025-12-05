import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookLoansRoutingModule } from './book-loans.routing.module';
import { BookLoansIndexComponent } from '@app/modules/library/pages/book-loans/book-loans-index/book-loans-index.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { BookLoansFormComponent } from '@app/modules/library/pages/book-loans/book-loans-form/book-loans-form.component';
import { BookReturningFormComponent } from '@app/modules/library/pages/book-loans/book-returning-form/book-returning-form.component';
import { AddBookFormComponent } from './add-book-form/add-book-form.component';
import { AddBookNumberFormComponent } from './add-book-number-form/add-book-number-form.component';

@NgModule({
  declarations: [
    BookLoansIndexComponent,
    BookLoansFormComponent,
    BookReturningFormComponent,
    AddBookFormComponent,
    AddBookNumberFormComponent
  ],
  imports: [
    CommonModule,
    BookLoansRoutingModule,
    NzGridModule,
    SharedModule,
    TranslateModule
  ]
})
export class BookLoansModule { }
