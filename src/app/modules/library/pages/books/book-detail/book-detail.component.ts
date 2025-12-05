import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { BookDetailFormComponent } from '@app/modules/library/pages/books/book-detail-form/book-detail-form.component';
import { BookService } from '@app/modules/library/data-access/services/book.service';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { getTypeExport } from '@shared/utils/import-utils.class';
import { saveAs } from 'file-saver';
import { ViewPdfModalComponent } from '@shared/component/view-pdf-modal/view-pdf-modal.component';
import { BookFavouriteService } from '@app/modules/library/data-access/services/book-favourite.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  type: 'SACH_IN' | 'SACH_DIEN_TU' = 'SACH_IN';
  protected readonly Mode = Mode;
  bookId!: number;
  avatar: string;
  data: any;
  pdfSrc: any;

  constructor(injector: Injector,
              private bookService: BookService,
              private bookFavouriteService: BookFavouriteService
  ) {
    super(injector);
    this.formConfig = {
      title: 'library.details.label.book',
      content: BookDetailFormComponent
    };
    this.bookId = this.route.snapshot.queryParams.bookId;
    this.initData();
    this.isCustomSearch = true;
  }


  initData() {
    this.bookService.findOneById(this.bookId, UrlConstant.BOOKS.AVATAR, true).subscribe(res => {
      if (res?.code === HTTP_STATUS_CODE.SUCCESS) {
        this.avatar = res?.data ? 'data:image/jpg;base64,' + res?.data : '';
      }
    });
    this.getData();
  }

  getData() {
    this.bookService.findOneById(this.bookId).subscribe(res => {
      if (res?.code === HTTP_STATUS_CODE.SUCCESS) {
        this.data = res.data;
        const array = this.data?.tags?.split(', ');
        const updatedElements = array?.map(element => `#${element.trim()}`);
        this.data.tags = updatedElements?.join(', ');
        this.type = this.data?.type;
      }
    });
  }

  doDownloadFile(download: boolean = true, fileName: string = this.data?.title ? this.data?.title + '.pdf' : 'book.pdf') {
    this.bookService.downloadFile(UrlConstant.BOOKS.FILE.replace('{id}', this.bookId.toString()), {isNotAutoPreview: true})
      .subscribe((res: any) => {
      if (res?.body.size > 0) {
        const reportFile = new Blob([res?.body], { type: getTypeExport(fileName.split('.').pop()) });
        this.pdfSrc = URL.createObjectURL(reportFile);
        if (download) {
          saveAs(reportFile, fileName);
        } else {
          this.viewPdf();
        }
      }
    });
  }

  viewPdf() {
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzTitle: this.data?.title,
      nzContent: ViewPdfModalComponent,
      nzComponentParams: {
        pdfSrc: this.pdfSrc
      },
      nzFooter: null,
      nzClassName: 'view__book'
    });
  }

  navigateToAddPage() {
    this.router.navigate(['/library/books/edit-book'], {
      queryParams: {
        data: JSON.stringify({ id: this.bookId }),
        mode: Mode.EDIT
      }
    });
  }


  doFavourite(type: 'like' | 'unlike') {
    if (type === 'like') {
      this.bookFavouriteService.createOrImport(null, REQUEST_TYPE.FORM_DATA, '/' + type + '/' + this.bookId).subscribe(res => {
        this.toast.success(
          this.translate.instant('common.notification.updateSuccess')
        );
        this.getData();
      });
    } else {
      this.bookFavouriteService.update({ id: this.bookId }, REQUEST_TYPE.FORM_DATA, '/' + type).subscribe(res => {
        this.toast.success(
          this.translate.instant('common.notification.updateSuccess')
        );
        this.getData();
      });
    }
  }


}
