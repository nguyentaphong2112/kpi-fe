import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { BookLoansService } from '@app/modules/library/data-access/services/book-loans.service';
import { BookEditionDetailService } from '@app/modules/library/data-access/services/book-edition-detail.service';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Validators } from '@angular/forms';
import { REQUEST_TYPE } from '@shared/constant/common';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.scss']
})
export class AddBookFormComponent extends BaseListComponent<NzSafeAny> implements OnInit {

  serviceName = MICRO_SERVICE.LIBRARY;
  urlLoadData = UrlConstant.BOOKS.GET_LIST;
  urlLoadBookEdition = UrlConstant.BOOK_EDITION.GET_LIST_BOOK_EDITION;
  boardCode = '';
  isBookEditionDetail = false;
  listBoardCode = [];

  constructor(injector: Injector,
              private bookLoansService: BookLoansService,
              private bookEditionDetailService: BookEditionDetailService) {
    super(injector);
    this.initFormSearch();
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
          this.tableData = this.listBoardCode.map(item => {
            return { bookNo: item };
          });
        } else {
          this.toast.error(
            this.translate.instant('common.notification.bookNoInvalid')
          );
        }
        this.boardCode = '';
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
      bookId: [null, [Validators.required]],
      bookEditionId: [null, [Validators.required]]
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
        title: 'library.bookLoan.label.bookNo',
        thClassList: ['text-center'],
        field: 'bookNo'
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

  deleteData(data: any) {
    this.listBoardCode = this.listBoardCode.filter(item => item !== data.bookNo);
    this.tableData = this.listBoardCode.map(item => {
      return { bookNo: item };
    });
  }


  doBookChange($event) {
    if ($event !== null) {
      this.urlLoadBookEdition = UrlConstant.BOOK_EDITION.GET_LIST_BOOK_EDITION + $event;
      this.isBookEditionDetail = true;
      this.form.controls.bookEditionId.setValue(null);
    } else {
      this.isBookEditionDetail = false;
      this.urlLoadBookEdition = UrlConstant.BOOK_EDITION.GET_LIST_BOOK_EDITION;
      this.form.controls.bookEditionId.setValue(null);
    }
  }

  save() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const request = {
        bookEditionId: this.form.controls.bookEditionId.value,
        bookNos: this.listBoardCode
      };
      this.bookEditionDetailService.createOrImport(request, REQUEST_TYPE.DEFAULT)
        .subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toast.success(
              this.translate.instant('common.notification.addSuccess')
            );
            this.modalRef?.close({ refresh: true });
          }
        });
    }
  }

}
