import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from '@shared/model/pagination';
import { Router } from '@angular/router';
import { BookService } from '@app/modules/library/data-access/services/book.service';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';

@Component({
  selector: 'app-book-category',
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.scss']
})
export class BookCategoryComponent implements OnInit, OnChanges {
  form!: FormGroup;
  pagination = new Pagination();
  data: any[] = [];
  @Input() type!: string;
  url: string;
  name: string;
  dataAll: any;
  range = [];
  @Input() params: any;

  constructor(private router: Router,
              private fb: FormBuilder,
              private bookService: BookService
  ) {
  }

  ngOnInit(): void {
    this.initFormSearch();
  }

  ngOnChanges() {
    if (this.type) {
      this.url = UrlConstant.BOOKS.SEARCH_TYPE.replace('{type}', this.type);
      this.name = this.type + 'Name';
      if (this.params) {
        this.search(1);
      } else {
        this.search();
      }
    }
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null]
    });
  }

  search(pageNumber?: number) {
    this.params.keySearch = this.form?.controls.keySearch?.value;
    this.pagination.pageNumber = pageNumber ?? 1;
    this.pagination.pageSize = 12;
    this.bookService.getFilterResearch(this.params, this.pagination.getCurrentPage(), this.url).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.dataAll = res.data;
        this.data = res.data.listData;
        this.range = [];
        this.range.push((this.dataAll.pageIndex - 1) * 12 + 1);
        this.range.push(((this.dataAll.pageIndex - 1) * 12) + this.data.length);
      }
    });
  }
}
