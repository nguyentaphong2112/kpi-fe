import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { BookLoansFormComponent } from '@app/modules/library/pages/book-loans/book-loans-form/book-loans-form.component';
import { Mode } from '@shared/constant/common';
import { AddBookFormComponent } from '@app/modules/library/pages/book-loans/add-book-form/add-book-form.component';
import { BookReturningFormComponent } from '@app/modules/library/pages/book-loans/book-returning-form/book-returning-form.component';
import { AddBookNumberFormComponent } from '@app/modules/library/pages/book-loans/add-book-number-form/add-book-number-form.component';

@Component({
  selector: 'app-book-loans-index',
  templateUrl: './book-loans-index.component.html',
  styleUrls: ['./book-loans-index.component.scss']
})
export class BookLoansIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {

  constructor(injector: Injector) {
    super(injector);
    this.isCustomSearch = true;
  }

  openModal(type: 'LOAN' | 'RETURNING' | 'ADD' | 'CREATE') {
    if (type === 'LOAN') {
      this.formConfig = {
        title: 'library.bookLoan.label.loan',
        content: BookLoansFormComponent
      };
      this.doOpenForm(Mode.EDIT);
    } else if (type === 'ADD') {
      this.formConfig = {
        title: 'library.bookLoan.label.add',
        content: AddBookFormComponent
      };
      this.doOpenForm(Mode.ADD);
    } else if (type === 'CREATE') {
      this.formConfig = {
        title: 'library.bookLoan.label.bookCode',
        content: AddBookNumberFormComponent
      };
      this.doOpenForm(Mode.ADD);
    } else {
      this.formConfig = {
        title: 'library.bookLoan.label.reservation',
        content: BookReturningFormComponent
      };
      this.doOpenForm(Mode.EDIT);
    }
  }


}
