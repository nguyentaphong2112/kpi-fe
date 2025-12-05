import { Component, EventEmitter, HostListener, Injector, Input, OnInit, Output } from '@angular/core';
import { Scopes } from '@core/utils/common-constants';
import { HTTP_STATUS_CODE, STORAGE_NAME } from '@core/constant/system.constants';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { Validators } from '@angular/forms';
import { UserLogin } from '@shared/model/user-login';
import { StorageService } from '@core/services/storage.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { BaseResponse } from '@core/models/base-response';
import { SelectCheckAbleModal } from '@shared/component/hbt-select-able/select-able.component';
import { SEARCH_FORM_ADVANCE, SEARCH_INFO_TYPE } from './search-form.config';
import * as _ from 'lodash';
import {
  SearchFormSharedService
} from '@app/modules/hrm/data-access/services/staff-research/search-form-shared.service';
import { Utils } from '@core/utils/utils';
import { ObjectUtil } from '@core/utils/object.util';
import { BaseListComponent } from '@core/components/base-list.component';
import { AppFunction } from '@core/models/app-function.interface';
import { ExtendFieldModel } from '@app/modules/hrm/data-access/models/research/extend-field.model';
import { BookmarkFormService } from '@app/modules/hrm/data-access/services/staff-research/bookmark-form.service';
import { SearchFormService } from '@app/modules/hrm/data-access/services/search-form.service';
import { BookmarkModel, Option } from '@app/modules/hrm/data-access/models/research/bookmark.model';
import { parse } from 'date-fns';

@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent extends BaseListComponent<any> implements OnInit {
  @Input() objFunction: AppFunction;
  @Input() isShowBtnAdd = true;
  @Input() isShowBtnAddCustom = false;
  @Input() isShowBtnImport = false;
  @Input() addWidth = 0;
  @Input() formConfig: any;
  @Input() formConfigCustom: any;
  @Input() moduleName = '';
  @Input() scope: string = Scopes.VIEW;
  @Input() functionCode = '';
  @Output() submitEventSearch = new EventEmitter<boolean>();
  @Output() submitEventExport = new EventEmitter<boolean>();
  @Output() submitEventImport = new EventEmitter<boolean>();
  @Output() isDataSelectReadyEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  urlConstantShare = UrlConstantShare;
  typeSearchData!: any[];
  formConfigExtendField: ExtendFieldModel[] = [];
  listExtendField: ExtendFieldModel[] = [];
  bookmarks: BookmarkModel[] = [];
  userLogin: UserLogin = new UserLogin();
  saveBookmarkName?: string = '';
  saveBookmarkVisible = false;
  choseBookmarkId?: number;
  chooseBookmarkVisible = false;
  isShowAdvSearch = false;
  listOldExtentSelect: any[] = [];

  constructor(
    injector: Injector,
    private bookmarkFormService: BookmarkFormService,
    private searchFormService: SearchFormService,
    private searchFormSharedService: SearchFormSharedService
  ) {
    super(injector);
    this.form = this.fb.group({
      keySearch: [null],
      flagStatus: [null],
      listStatus: [null],
      organizationId: [null],
      listEmpTypeId: [null],
      listPositionId: [null],
      extendField: null,
      typeSearch: [null, [Validators.required]]
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submitSearch();
    }
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.initDataSelect();
    this.f.typeSearch.setValue(this.typeSearchData?.find(item => this.router.url?.includes(`/${item.value}`))?.value, { emitEvent: false });
    this.userLogin = StorageService.get(STORAGE_NAME.USER_LOGIN);
    this.searchFormSharedService.getSearchForm().subscribe(value => {
      if (value) {
        this.isShowAdvSearch = value.isShowAdvSearch;
        delete value.typeSearch;
        this.form.patchValue(value, { emitEvent: false });
      }
    });
    this.f.extendField.setValue(null);
    // this.getBookmark();
  }

  changeTypeSearch(value) {
    if (value) {
      this.redirectToResult();
    }
  }

  redirectToResult() {
    const dataType = this.typeSearchData.find(item => item.value === this.f.typeSearch.value);
    if (dataType && this.router.url !== dataType.url) {
      this.searchFormSharedService.setSearchForm({ ...this.form.value, isShowAdvSearch: this.isShowAdvSearch });
      this.router.navigateByUrl(dataType.url).then();
    }
  }

  initDataSelect() {
    const listSearchType = SEARCH_INFO_TYPE;
    this.typeSearchData = ObjectUtil.optionsToList(listSearchType, this.translate);
    this.listExtendField = SEARCH_FORM_ADVANCE.filter(item => item.moduleName?.includes(this.moduleName) || item.moduleName?.includes('ALL'));
  }

  // getBookmark() {
  //   this.bookmarkFormService.getBookmark(this.moduleName).subscribe((res: BaseResponse<any>) => {
  //     if (res.code === HTTP_STATUS_CODE.SUCCESS) {
  //       this.bookmarks = res.data.filter((item: NzSafeAny) => item.code !== 'flagStatus');
  //     }
  //   });
  // }

  doAddOrRemoveFieldExtend(items: SelectCheckAbleModal, addFormControl: boolean = true, setFormValue?: boolean, itemField?: ExtendFieldModel, option?: Option) {
    if (addFormControl) {
      this.formConfigExtendField = [];
    }
    this.listOldExtentSelect.forEach(key => {
      if (!items.listOfSelected.includes(key) && this.form.contains(key)) {
        this.form.removeControl(key);
      }
    });
    items.listOfSelected?.forEach(item => {
      itemField = this.listExtendField[this.listExtendField.findIndex(x => x.code === item)];
      if (itemField) {
        if (addFormControl) {
          this.form.addControl(item, this.fb.control(null));
        }
        if (setFormValue) {
          this.setFormValueChooseBookmark(itemField, option);
          this.ref.markForCheck();
        }
        this.formConfigExtendField.push(itemField);
      }
    });
    this.listOldExtentSelect = items.listOfSelected;
  }

  saveBookmark(id?: number) {
    if (this.saveBookmarkName.trim() !== '') {
      const bm: BookmarkModel | NzSafeAny = new BookmarkModel();
      bm.userBookmarkId = id;
      bm.bookmarkType = this.moduleName;
      bm.name = id ? (this.saveBookmarkName ?? this.bookmarks.find(b => b.userBookmarkId === id)?.name) : this.saveBookmarkName;
      bm.listOptions = this.getOptions();
      const requestApi = bm.userBookmarkId ? this.bookmarkFormService.upDateBookmark(bm) : this.bookmarkFormService.createBookmark(bm);
      requestApi.subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          // this.getBookmark();
          this.saveBookmarkName = undefined;
          this.saveBookmarkVisible = false;
          this.ref.markForCheck();
        }
      });
    } else {
      this.toast.error(this.translate.instant('common.validate.required', { param: this.translate.instant('hrm.staffManager.label.saveName') }));
    }
  }

  chooseBookmark() {
    this.formConfigExtendField = [];
    const fields: NzSafeAny[] = [];
    const bookmark = this.bookmarks.find(bm => bm.userBookmarkId === this.choseBookmarkId);
    bookmark?.listOptions?.forEach((option) => {
      if (option.code === 'listStatus') {
        this.form.patchValue({ listStatus: option.values });
        return;
      } else if (option.code === 'listEmpTypeId') {
        this.form.patchValue({ listEmpTypeId: option.values });
        return;
      } else if (option.code === 'listPositionId') {
        this.form.patchValue({ listPositionId: option.values });
        return;
      } else if (option.code === 'organizationId') {
        this.f.organizationId.patchValue(option.values[0]);
      }
      const itemField = this.listExtendField[this.listExtendField.findIndex(x => x.code === option.code)];
      if (itemField) {
        fields.push(itemField.code);
        this.form.addControl(itemField.code, this.fb.control(null));
        this.doAddOrRemoveFieldExtend({ listOfSelected: [itemField.code] }, false, true, itemField, option);
      }
    });
    this.form.patchValue({ extendField: fields });
    this.chooseBookmarkVisible = false;
  }

  setFormValueChooseBookmark(itemField: ExtendFieldModel, option: Option | NzSafeAny) {
    switch (itemField.inputType) {
      case 'date':
        this.f[itemField.code].setValue([
          option.valueFrom ? parse(option.valueFrom, 'dd/MM/yyyy', new Date()) : null,
          option.valueTo ? parse(option.valueTo, 'dd/MM/yyyy', new Date()) : null
        ]);
        break;
      case 'text':
      case 'combobox':
      case 'radiobox':
        this.f[itemField.code]?.setValue(option?.values ? option?.values[0] : null);
        break;
      case 'number':
        this.f[itemField.code].setValue(
          [option.valueFrom ? Number(option.valueFrom) : null,
            option.valueTo ? Number(option.valueTo) : null
          ]);
        break;
      case 'multi-combobox':
        this.f[itemField.code].setValue(option.values);
        break;
      case 'checkbox':
        this.f[itemField.code].setValue(option.values);
        break;
      default:
        break;
    }
  }

  deleteBookmark() {
    this.bookmarkFormService.deleteBookmark(this.choseBookmarkId).subscribe((res: BaseResponse<any>) => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.deleteSuccess'));
        this.choseBookmarkId = undefined;
        // this.getBookmark();
      }
    });
  }

  getOptions(): Option[] {
    const options: Option[] = [];
    const option = new Option();
    option.code = 'listStatus';
    option.values = this.f.listStatus.value ? this.f.listStatus.value : [];
    options.push(_.clone(option));
    option.code = 'listEmpTypeId';
    option.values = this.f.listEmpTypeId.value ? this.f.listEmpTypeId.value : [];
    options.push(_.clone(option));
    option.code = 'listPositionId';
    option.values = this.f.listPositionId.value ? this.f.listPositionId.value : [];
    options.push(_.clone(option));
    option.code = 'organizationId';
    option.values = this.f.organizationId.value ? [this.f.organizationId.value] : [];
    options.push(_.clone(option));
    this.formConfigExtendField.forEach(field => {
      const optionConfig: NzSafeAny = new Option();
      optionConfig.code = field.code;
      switch (field.inputType) {
        case 'date':
          optionConfig.valueFrom = this.f[field.code].value ? Utils.convertDateToSendServer(this.f[field.code].value[0]) : null;
          optionConfig.valueTo = this.f[field.code].value ? Utils.convertDateToSendServer(this.f[field.code].value[1]) : null;
          break;
        case 'number':
          optionConfig.valueFrom = this.f[field.code].value[0];
          optionConfig.valueTo = this.f[field.code].value[1];
          break;
        case 'text':
          optionConfig.values = this.f[field.code].value ? [this.f[field.code].value] : [];
          break;
        case 'combobox':
        case 'multi-combobox':
          optionConfig.values = this.f[field.code].value ? this.f[field.code].value : [];
          break;
        case 'checkbox':
          optionConfig.values = this.f[field.code].value ?? [];
          break;
        default:
          optionConfig.values = [];
          break;
      }
      options.push(optionConfig);
    });
    return options;
  }

  validateDate(date: NzSafeAny, code: NzSafeAny) {
    if (date && date[1] && date[0] > date[1]) {
      this.f[code].setErrors({ [code]: true });
    } else {
      this.f[code].setErrors(null);
    }
  }

  validateDateNumber(date: NzSafeAny, code: NzSafeAny) {
    if (date && date[1] && parseInt(date[0], 10) > parseInt(date[1], 10)) {
      this.f[code].setErrors({ [code]: true });
    } else {
      this.f[code].setErrors(null);
    }
  }

  submitSearch() {
    this.submitEventSearch.emit(true);
  }

  doExport() {
    this.submitEventExport.emit(true);
  }

  doImportData() {
    this.submitEventImport.emit(true);
  }

  override search() {
    this.submitEventSearch.emit(true);
  }

  doOpenFormCustom() {
    this.formConfig = this.formConfigCustom;
    this.doOpenForm(this.modeConst.ADD, {});
  }
}
