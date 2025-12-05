import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/library/data-access/constants/constants';
import { ConfigTree } from '@shared/component/hbt-tree-view/hbt-tree-view.component';
import { ObjectUtil } from '@core/utils/object.util';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';

@Component({
  selector: 'app-book-layout',
  templateUrl: './book-layout.component.html',
  styleUrls: ['./book-layout.component.scss']
})
export class BookLayoutComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  urlLoadNodeBook = UrlConstant.BOOKS.NODE_BOOK;
  urlLoadNodeTranslator = UrlConstant.CATEGORIES.NODE_PAGE_TRANSLATOR;
  urlLoadNodeAuthor = UrlConstant.CATEGORIES.NODE_PAGE_AUTHOR;
  urlLoadNodeLanguage = UrlConstant.CATEGORIES.NODE_PAGE_LANGUAGE;
  serviceLibrary = MICRO_SERVICE.LIBRARY;
  serviceAdmin = MICRO_SERVICE.ADMIN;
  showIconCaretDown = true;
  listTypeBook: CategoryModel[] = [];
  type: string;
  indexActive = 0;
  params: any;
  dataConfig: ConfigTree = { asyncData: false };
  isChecked = true;

  constructor(injector: Injector) {
    super(injector);
    this.initFormSearch();
  }

  initFormSearch() {
    this.form = this.fb.group({
        authorIds: null,
        translatorIds: null,
        types: null,
        languageIds: null,
        keySearch: null,
        genreIds: null,
        favourite: false
      }
    );
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe();
    this.initDataSelect();
  }

  initDataSelect() {
    this.listTypeBook = ObjectUtil.optionsToList(Constant.BOOK_TYPES, this.translate);
  }

  selectNode(event: any) {
    if (event) {
      this.form.controls.genreIds.setValue([event.id]);
    } else {
      this.form.controls.genreIds.setValue(null);
    }
    this.search();
  }

  search() {
    this.params = this.form.value;
  }

  checkLabel() {
    this.isChecked = !this.isChecked;
  }

  selectedIndexChange(index: number) {
    if (index === 1) {
      this.type = 'genre';
    } else if (index === 2) {
      this.type = 'author';
    } else {
      this.type = 'translator';
    }
    this.indexActive = index;
  }

  navigateToAddPage() {
    this.router.navigate(['/library/books/add-book']);
  }

  emitParams(event) {
    this.form.patchValue(event);
  }
}
