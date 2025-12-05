import { Component, Injector, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { BaseFormComponent } from '@core/components/base-form.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { EditionDto } from '@app/modules/library/data-access/models/books.model';
import { BookService } from '@app/modules/library/data-access/services/book.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { Utils } from '@core/utils/utils';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { format } from "date-fns";

@Component({
  selector: 'hbt-fe-book-edit',
  templateUrl: './book-edition-form.component.html',
  styleUrls: ['./book-edition-form.component.scss']
})
export class BookEditionFormComponent extends BaseFormComponent<EditionDto> implements OnInit {
  protected readonly MICRO_SERVICE = MICRO_SERVICE;
  serviceName = MICRO_SERVICE.ADMIN;
  urlLoadData = '/resource';
  urlLoadPublisher = UrlConstant.CATEGORIES.NODE_PUBLISHER;
  urlLoadStore = UrlConstant.CATEGORIES.NODE_STORE;
  urlLoadFormat = UrlConstant.CATEGORIES.NODE_FORMAT;

  constructor(
    private readonly service: BookService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'resourceId';

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: EditionDto) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: EditionDto) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initForm();
    if (this.data && this.mode === Mode.EDIT) {
      this.form.patchValue(this.data);
      this.f['publishedYear'].patchValue(Utils.convertDateToFillForm(this.data?.publishedYear.toString(), 'yyyy'));
    }
  }

  override initForm(): void {
    this.form = this.fb.group({
      bookEditionId: [null],
      publisherId: [null, Validators.required],
      publisherName: [null],
      publishedYear: [null, [Validators.required, Validators.maxLength(100)]],
      bookFormatId: [null, Validators.required],
      bookFormatName: [null],
      totalPages: [null, [Validators.required, Validators.maxLength(100)]],
      storeId: [null, Validators.required],
      storeName: [null],
    }, {
      validators: [
        DateValidator.validateYearGreaterThanCurrentYear('publishedYear')
      ]
    });

  }

  changeValue(event, formControlName: string) {
    this.f[formControlName].setValue(event?.itemSelected?.name);
  }

  override save() {
    this.isSubmitted = true;
    if (this.form.valid) {
      if (this.form.get('publishedYear').value) {
        const year = format(this.form.get('publishedYear').value, 'yyyy');
        this.form.get('publishedYear').setValue(year);
      }
      this.modalRef.close({ data: this.form.value });
    }
  }

  changeIssueYear(year: NzSafeAny) {
    const dateNow = new Date();
    if (isNaN(parseInt(year)) && year?.getFullYear() > dateNow.getFullYear()) {
      this.f['publishedYear'].setErrors({ 'required': true });
    } else {
      this.f['publishedYear'].setErrors(null);
    }
  }


}
