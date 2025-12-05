import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Category } from '@shared/model/category';
import { BookEditionFormComponent } from '@app/modules/library/pages/books/book-edition-form/book-edition-form.component';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { BookDetailFormComponent } from '@app/modules/library/pages/books/book-detail-form/book-detail-form.component';
import { Constant } from '@app/modules/library/data-access/constants/constants';
import { Books, EditionDto } from '@app/modules/library/data-access/models/books.model';
import { BookService } from '@app/modules/library/data-access/services/book.service';
import { DataConfig } from '@shared/component/tree-data-picker/tree-data-picker.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { Utils } from '@core/utils/utils';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { ToastrService } from 'ngx-toastr';
import { format } from "date-fns";

@Component({
  selector: 'hbt-fe-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent extends BaseFormComponent<any> implements OnInit {
  protected readonly MICRO_SERVICE = MICRO_SERVICE;
  protected readonly Mode = Mode;

  serviceAdmin = MICRO_SERVICE.ADMIN;
  serviceLibrary = MICRO_SERVICE.LIBRARY;
  urlLoadAuthor = UrlConstant.CATEGORIES.NODE_PAGE_AUTHOR;
  urlLoadTranslator = UrlConstant.CATEGORIES.NODE_PAGE_TRANSLATOR;
  urlLoadLanguage = UrlConstant.CATEGORIES.NODE_PAGE_LANGUAGE;
  urlLoadGenre = UrlConstant.GENRES.URL_TREE;
  urlLoadPublisher = UrlConstant.CATEGORIES.NODE_PUBLISHER;
  sachIn = 'SACH_IN';
  sachDienTu = 'SACH_DIEN_TU';
  inVaDienTu = 'IN_VA_DIEN_TU';
  urlDownload = UrlConstant.BOOKS.DOWNLOAD;

  fileList: NzUploadFile[] = [];
  digitalFileList: NzUploadFile[] = [];
  docIdsDelete: number[] = [];
  isSachIn: boolean = false;
  isSachDienTu: boolean = false;
  isInVaDienTu: boolean = false;
  typeList: Category[] = [];
  bookEditionData: EditionDto[] = [];
  bookEdition: EditionDto;

  dataConfig: DataConfig = {
    titleTree: 'common.organization.bookTree',
    titleHeader: 'common.organization.bookOrg',
    domainName: 'common.organization.bookName',
    parentName: 'common.organization.bookManagement'
  };

  addWidth = 0;
  formConfig!: { title: string; content: any };
  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;

  constructor(
    private readonly service: BookService,
    private toastService: ToastrService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (formData: Books) => this.service.createOrImport(CommonUtils.convertDataSendToServer(formData), REQUEST_TYPE.FORM_DATA_FILE);
    this.updateApi = (formData: Books) => this.service.update(CommonUtils.convertDataSendToServer(formData), REQUEST_TYPE.FORM_DATA_FILE);
  }

  updateValidators() {
    if (this.isSachDienTu) {
      this.form.get('publisherId')?.setValidators([Validators.required, Validators.maxLength(100)]);
      this.form.get('publishedYear')?.setValidators([Validators.required, Validators.maxLength(100)]);
    } else {
      this.form.get('publisherId')?.clearValidators();
      this.form.get('publishedYear')?.clearValidators();
    }
    this.form.get('publisherId')?.updateValueAndValidity();
    this.form.get('publishedYear')?.updateValueAndValidity();
  }

  override initForm() {
    this.form = this.fb.group({
      bookId: [null],
      title: [null, [Validators.required, Validators.maxLength(500)]],
      subtitle: [null, [Validators.maxLength(500)]],
      originalTitle: [null, [Validators.maxLength(500)]],
      publisherId: [null, [Validators.maxLength(100)]],
      publishedYear: [null, [Validators.maxLength(100)]],
      type: [null, Validators.required],
      genreId: [null, Validators.required],
      authorId: [null, Validators.required],
      translatorIds: [null],
      languageId: [null, Validators.required],
      tags: [null, [Validators.maxLength(4000)]],
      summary: [null, Validators.maxLength(4000)],
      tableOfContents: [null, Validators.maxLength(4000)],
      fileAvatar: [null],
      fileContent: [null]
    }, {
      validators: [
        DateValidator.validateYearGreaterThanCurrentYear('publishedYear')
      ]
    });
    this.initDataSelect();
  }

  initDataSelect() {
    this.typeList = Constant.BOOK_TYPES.map(item => {
      item.label = this.translate.instant(item.label);
      return item;
    });
  }

  onTypeChange(selectedValue: string): void {
    this.isSachIn = selectedValue === this.sachIn;
    this.isSachDienTu = selectedValue === this.sachDienTu;
    this.isInVaDienTu = selectedValue === this.inVaDienTu;
    this.updateValidators();
  }


  loadBookData(): void {
    this.bookEditionData.push(this.bookEdition);
  }

  onFileListChange(fileList: any[]): void {
    this.fileList = fileList;
    this.form.patchValue({ fileAvatar: this.fileList });
  }

  onDigitalFileListChange(event: NzUploadFile[]): void {
    this.digitalFileList = event;
    this.form.patchValue({ fileContent: this.digitalFileList });

  }

  removeFileCustom(fileToRemove: any): void {
    this.fileList = this.fileList.filter(file => file.id !== fileToRemove.id);
    this.form.patchValue({ fileAvatar: this.fileList.length > 0 ? this.fileList : null });
  }

  removeDigitalFile(digitalFileToRemove: any): void {
    this.digitalFileList = this.digitalFileList.filter(file => file.id !== digitalFileToRemove.id);
    this.form.patchValue({ fileContent: this.digitalFileList.length > 0 ? this.digitalFileList : null });
  }

  doOpenForm(type?: Mode, index?: number, id?: any): void {
    let data = type === Mode.EDIT ? this.bookEditionData[index] : null;
    if (id) {
      data['id'] = id;
    }
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() + (this.addWidth ? this.addWidth : 0),
      nzTitle: '',
      nzContent: BookDetailFormComponent,
      nzComponentParams: {
        type,
        data
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
    });
  }

  doOpenFormEdit(type?: Mode, index?: number) {
    let data = type === Mode.EDIT ? this.bookEditionData[index] : null;
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() + (this.addWidth ? this.addWidth : 0),
      nzTitle: this.getModeTitle(type),
      nzContent: BookEditionFormComponent,
      nzComponentParams: {
        mode: type,
        data: data
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
      if (result?.data) {
        this.bookEdition = result.data;
        if (type === Mode.EDIT) {
          this.bookEditionData[index] = { ...result.data };
        } else {
          this.loadBookData();
        }
      }
    });
  }

  beforeSave() {
    this.body.listEditions = this.bookEditionData;
    this.body.genreId = this.f['genreId'].value;
    const data = this.body;
    data.tags = data.tags?.join(', ');
    if (data.type === this.sachDienTu) {
      if (this.form.get('publishedYear').value) {
        const year = format(this.form.get('publishedYear').value, 'yyyy');
        data.listEditions = [
          {
            publisherId: data.publisherId,
            publishedYear: year
          }
        ];
      }
    }
    this.body = {
      id: this.id,
      data: data,
      fileAvatar: this.form.value.fileAvatar,
      fileContent: this.form.value.fileContent
    };
  }

  changeIssueYear(year: NzSafeAny) {
    const dateNow = new Date();
    if (isNaN(parseInt(year)) && year?.getFullYear() > dateNow.getFullYear()) {
      this.f['publishedYear'].setErrors({ 'required': true });
    } else {
      this.f['publishedYear'].setErrors(null);
    }
  }

  beforePatchValue() {

  }

  override afterPatchValue() {
    this.f['tags'].setValue(this.data?.tags?.split(', '));
    if (this.data?.type == 'SACH_DIEN_TU') {
      this.f['publisherId'].patchValue(this.data?.listEditions[0].publisherId);
      this.f['publishedYear'].patchValue(Utils.convertDateToFillForm(this.data?.listEditions[0].publishedYear, 'yyyy'));
    }
    if (this.data?.fileAvatar) {
      this.data?.fileAvatar.forEach(item => {
        this.fileList.push({
          uid: item.attachmentId,
          checkSum: item.checkSum,
          name: item.fileName,
          status: 'done'
        });
      });
    }
    if (this.data?.fileContent) {
      this.data?.fileContent.forEach(item => {
        this.digitalFileList.push({
          uid: item.attachmentId,
          checkSum: item.checkSum,
          name: item.fileName,
          status: 'done'
        });
      });
    }
    this.bookEditionData = this.data?.listEditions;
  }

  changeValue(event, formControlName: string) {
    this.f[formControlName].setValue(event?.itemSelected?.name);
  }

}
