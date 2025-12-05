import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { BookLoansService } from '@app/modules/library/data-access/services/book-loans.service';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { BaseListComponent } from '@core/components/base-list.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { BookEditionDetailService } from '@app/modules/library/data-access/services/book-edition-detail.service';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { Validators } from '@angular/forms';
import { REQUEST_TYPE } from '@shared/constant/common';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-book-loans-form',
  templateUrl: './book-loans-form.component.html',
  styleUrls: ['./book-loans-form.component.scss']
})
export class BookLoansFormComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  serviceName = MICRO_SERVICE.LIBRARY;
  urlLoadData = UrlConstant.MEMBERS.GET_LIST_MEMBER;
  boardCode = '';
  listBoardCode = [];


  constructor(injector: Injector,
              private bookLoansService: BookLoansService,
              private bookEditionDetailService: BookEditionDetailService) {
    super(injector);
    this.initFormSearch();
    this.initAction();
    this.isCustomSearch = true;
    this.key = 'bookEditionDetailId';
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

  initFormSearch() {
    this.form = this.fb.group({
      memberId: [null, [Validators.required]]
    });
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
        title: 'library.bookLoan.label.borrowedDate',
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

  override search(bookNo: any) {
    this.params = this.form.value;
    this.bookEditionDetailService.getList(this.params, UrlConstant.BOOK_EDITION_DETAIL.GET_INFO.replace('{bookNo}', bookNo))
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


  save() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const request = {
        bookEditionDetailIds: this.tableData.map(item => item.bookEditionDetailId)
      };
      this.bookLoansService.createOrImport(request, REQUEST_TYPE.DEFAULT, UrlConstant.BOOK_LOANS.BORROW_BOOKS.replace('{memberId}', this.form.controls.memberId.value))
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


}
