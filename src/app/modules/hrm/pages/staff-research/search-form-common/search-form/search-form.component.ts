import { Component, EventEmitter, HostListener, Injector, Input, OnInit, Output } from '@angular/core';
import { Scopes } from '@core/utils/common-constants';
import { STORAGE_NAME } from '@core/constant/system.constants';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { Validators } from '@angular/forms';
import { UserLogin } from '@shared/model/user-login';
import { StorageService } from '@core/services/storage.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { SelectCheckAbleModal } from '@shared/component/hbt-select-able/select-able.component';
import { SEARCH_FORM_ADVANCE, SEARCH_INFO_TYPE } from './search-form.config';
import {
  SearchFormSharedService
} from '@app/modules/hrm/data-access/services/staff-research/search-form-shared.service';
import { ObjectUtil } from '@core/utils/object.util';
import { BaseListComponent } from '@core/components/base-list.component';
import { AppFunction } from '@core/models/app-function.interface';
import { BookmarkFormService } from '@app/modules/hrm/data-access/services/staff-research/bookmark-form.service';
import { SearchFormService } from '@app/modules/hrm/data-access/services/search-form.service';
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
  formConfigExtendField: any[] = [];
  listExtendField: any[] = [];
  bookmarks: any[] = [];
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

  doAddOrRemoveFieldExtend(items: SelectCheckAbleModal, addFormControl: boolean = true, setFormValue?: boolean, itemField?: any, option?: any) {
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


  setFormValueChooseBookmark(itemField: any, option: NzSafeAny) {
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
