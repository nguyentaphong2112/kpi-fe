import { Component, Injector, OnInit } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Validators } from '@angular/forms';
import { BookEditionDetailService } from '@app/modules/library/data-access/services/book-edition-detail.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';

@Component({
  selector: 'app-add-book-number-form',
  templateUrl: './add-book-number-form.component.html',
  styleUrls: ['./add-book-number-form.component.scss']
})
export class AddBookNumberFormComponent extends BaseListComponent<NzSafeAny> implements OnInit {

  constructor(injector: Injector,
              private bookEditionDetailService: BookEditionDetailService) {
    super(injector);
    this.initFormSearch();
    this.isCustomSearch = true;
  }

  initFormSearch() {
    this.form = this.fb.group({
      total: [null, [Validators.maxLength(4), Validators.min(1)]]
    });
  }

  save() {
    this.isSubmitted = true;
    if (this.form.valid && this.form.controls.total.value > 0) {
      this.bookEditionDetailService.downloadFile(UrlConstant.BOOK_EDITION_DETAIL.GET_FILE.replace('{total}', this.form.controls.total.value)).toPromise();
    }
  }


}
