import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { BookLoansService } from '@app/modules/library/data-access/services/book-loans.service';
import { BookEditionDetailService } from '@app/modules/library/data-access/services/book-edition-detail.service';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-book-returning-form',
  templateUrl: './book-returning-form.component.html',
  styleUrls: ['./book-returning-form.component.scss']
})
export class BookReturningFormComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  boardCode = '';
  listBoardCode = [];

  constructor(injector: Injector,
              private bookLoansService: BookLoansService,
              private bookEditionDetailService: BookEditionDetailService) {
    super(injector);
    this.initAction();
    this.deleteApi = (id: number | string) => this.bookLoansService.deleteById(id.toString());
    this.isCustomSearch = true;
    this.modalRef = injector.get(NzModalRef);
  }


  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.boardCode !== '') {
        if (!this.listBoardCode.some(item => item === this.boardCode)) {
          this.listBoardCode.push(this.boardCode);
          this.search(this.boardCode);
        } else {
          this.toast.error(
            this.translate.instant('common.notification.bookNoInvalid')
          );
          this.boardCode = '';
        }
      }
      event.preventDefault();
    } else {
      if (event.key !== 'Shift') {
        this.boardCode += event.key;
      }
      setTimeout(() => {
        this.boardCode = '';
      }, 50);
    }
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: !this.objFunction?.delete,
          function: (evt: any) => {
            this.deleteData(evt);
          }
        })
      ]
    });
  }

  override search(bookNo: any) {
    this.bookEditionDetailService.getList(null, UrlConstant.BOOK_EDITION_DETAIL.GET_INFO.replace('{bookNo}', bookNo))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          res.data.dateNow = new Date();
          this.tableData = [
            ...this.tableData,
            res.data
          ];
        }
      });
    this.boardCode = '';
  }

  deleteData(data: any) {
    this.tableData = this.tableData.filter(item => item.bookEditionDetailId !== data.bookEditionDetailId);
    this.listBoardCode = this.listBoardCode.filter(item => item !== data.bookNo);
  }


  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50
      },
      {
        title: 'library.bookLoan.label.bookTitle',
        field: 'bookTitle',
        thClassList: ['text-center']
      },
      {
        title: 'library.bookLoan.label.bookNo',
        thClassList: ['text-center'],
        field: 'bookNo'
      },
      {
        title: 'library.bookLoan.label.borrower',
        thClassList: ['text-center'],
        field: 'borrowerName'
      },
      {
        title: 'library.bookLoan.label.borrowedDate',
        thClassList: ['text-center'],
        field: 'borrowedDate'
      },
      {
        title: 'library.bookLoan.label.returnDate',
        thClassList: ['text-center'],
        field: 'dateNow'
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 80,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }

  save() {
    this.isSubmitted = true;
    const request = {
      bookEditionDetailIds: this.tableData.map(item => item.bookEditionDetailId)
    };
    this.bookLoansService.updateBorrow(request, UrlConstant.BOOK_LOANS.RETURN_BOOKS)
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(
            this.translate.instant('common.notification.updateSuccess')
          );
          this.modalRef?.close({ refresh: true });
        }
      });
  }


}
