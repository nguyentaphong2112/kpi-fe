import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '@app/modules/library/data-access/services/book.service';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { Pagination } from '@shared/model/pagination';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-index',
  templateUrl: './book-index.component.html',
  styleUrls: ['./book-index.component.scss']
})
export class BookIndexComponent implements OnInit, OnChanges {
  form!: FormGroup;
  pagination = new Pagination();
  data: any[] = [];
  dataAll: any;
  range = [];
  @Input() params: any;
  @Output() emitParams = new EventEmitter<any>();
  listApi = [];


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private bookService: BookService,
    private translate: TranslateService,
    private message: NzMessageService,
    private toast: ToastrService
  ) {
  }

  ngOnInit() {
    this.initFormSearch();
    // this.loadSearchParams();
  }

  ngOnChanges() {
    if (this.params) {
      this.search(1);
    }
  }


  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null]
    });
  }

  async search(pageNumber?: number) {
    this.listApi = [];
    this.params.keySearch = this.form?.controls.keySearch.value;
    this.pagination.pageNumber = pageNumber ?? 1;
    this.pagination.pageSize = 12;
    // localStorage.setItem('oldParams', JSON.stringify(this.params));
    this.bookService.getFilterResearch(this.params, this.pagination.getCurrentPage(), UrlConstant.BOOKS.SEARCH, true).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.data = res.data.listData.map(item => {
          item.avatar = item.avatar ? `data:image/jpg;base64,${item.avatar}` : '';
          return item;
        });
        this.dataAll = res.data;
        this.range = [];
        this.range.push((this.dataAll.pageIndex - 1) * 12 + 1);
        this.range.push(((this.dataAll.pageIndex - 1) * 12) + this.data?.length);
        if (res.data.listData.length === 0) {
          this.toast.error(this.translate.instant('common.notification.noResultsFound'));
        }
      }
    });
  }


  openDetail(bookId: number) {
    this.router.navigate(['/library/books/detail'], { queryParams: { bookId } });
  }

  // private loadSearchParams() {
  //   if (localStorage.getItem("oldParams")) {
  //     const oldParams = JSON.parse(localStorage.getItem("oldParams"));
  //     if (oldParams) {
  //       this.form?.controls['keySearch'].setValue(oldParams.keySearch);
  //       this.params = oldParams;
  //       this.emitParams.emit(oldParams)
  //     }
  //     this.search(1);
  //     localStorage.removeItem("oldParams");
  //   }
  // }

}
