import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, DoCheck,
  EventEmitter,
  forwardRef, HostListener,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { debounceTime, noop, of, Subject } from 'rxjs';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { DataService } from '@shared/services/data.service';
import { Pagination } from '@shared/model/pagination';
import { catchError, map } from 'rxjs/operators';
import { BaseResponse } from '@core/models/base-response';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { Mode } from '@shared/constant/common';
import { CategorySystemFormComponent } from '@shared/component/category-system-form/category-system-form.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SessionService } from '@core/services/session.service';
import { UrlConstant } from '@shared/constant/url.class';
import { FunctionCode } from '@shared/enums/enums-constant';
import { SelectModal } from '@shared/component/hbt-select/select.component';

export class SelectCheckAbleModal {
  action?: 'SUBMIT' | 'CANCEL' | 'NG_MODEL_CHANGE';
  isCheckAll ? = false;
  listOfSelected?: any[] = [];
  itemChecked?: any;
  listItemSelected?: any[] = [];

  constructor(action?: 'SUBMIT' | 'CANCEL' | 'NG_MODEL_CHANGE', isCheckAll: boolean = false, listOfSelected: any[] = [], listItemSelected: any[] = [], itemChecked?: any) {
    this.action = action;
    this.isCheckAll = isCheckAll;
    this.listOfSelected = listOfSelected;
    this.listItemSelected = listItemSelected;
    this.itemChecked = itemChecked;
  }
}

@Component({
  selector: 'hbt-select-check-able',
  templateUrl: './select-able.component.html',
  styleUrls: ['../../../core/global-style/_select.scss', 'select-able.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectAbleComponent)
    }
  ]
})
export class SelectAbleComponent implements OnInit, ControlValueAccessor, OnChanges, OnDestroy {
  valueSearch = new Subject();
  isEmitInitData = false;
  private _valueSearch = '';
  private _changeSearch = false;
  @Input() functionCode = '';
  @Input() scope = '';
  @Input() empStatus = '';
  @Input() cacheGetRequest = true;
  @Input() showAddCategory: boolean | undefined = undefined;
  @Input() categoryTypeCode = '';
  @Input() customIconSearch: TemplateRef<any> | null = null;
  @Input() dataSelects: any[] = [];
  @Input() defaultData: any[] = [];
  @Input() isSearchAfterAction = false;
  @Input() urlLoadData = '';
  @Input() formMode: Mode = Mode.ADD;
  @Input() serviceName = '';
  @Input() inputParam = {};
  @Input() isRequiredInputParam = false;
  @Input() isLoadMore = false;
  @Input() showIconSearch = true;
  @Input() @InputBoolean() disable = false;
  @Input() pageSize = 5;
  @Input() showCheckAll = true;
  @Input() showAction = false;
  @Input() showSearch = true;
  @Input() checkAllKey = 'ALL';
  @Input() placeholder = '';
  @Input() selectIcon: 'search' | 'down' | string;
  @Input() maxTagCount = 3;
  @Input() optionHeightPx = 56;
  @Input() optionOverflowSize = 5;
  @Input() labelText: string;
  @Input() keyLabel = 'label';
  @Input() keyValue = 'value';
  @Input() @InputBoolean() keyValueStringType = false;
  @Input() errorDefs: { errorName: string, errorDescription: string }[];
  @Input() showIconMessage = true;
  @Input() showError = false;
  @Input() errors: any;
  @Input() type: 'default' | 'warning' | 'error' | 'success' = 'default';
  @Input() isLoading = false;
  @Input() isOpenOptions = false;
  @Input() translate = false;
  @Output() eventEmit: EventEmitter<SelectCheckAbleModal> = new EventEmitter<SelectCheckAbleModal>();
  @Output() onSearchEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() isLoadData = true;
  @Input() valueFilter = null;
  listOfSelectedValue: any[] = [];
  listItemSelected: any[] = [];
  isLoadMoreLoading = false;
  private total = 0;
  private fetchedPages = new Set<number>();
  private values = [];
  onTouched: () => void = noop;
  onChange: (_: any) => void = noop;
  ngControl?: NgControl;
  inputMessageClass = 'input__message';
  textMessageValue: any;
  showIcon: any;
  iconType: any;
  inputGroupGroupClass = 'select__group--group';
  classGroupGroup = {
    default: 'select__group--group--default',
    warning: 'select__group--group--warning',
    error: 'select__group--group--error',
    success: 'select__group--group--success'
  };
  classMessage = {
    default: 'select__message--default',
    warning: 'select__message--warning',
    error: 'select__message--error',
    success: 'select__message--success'
  };
  classIcon = {
    warning: 'warning',
    error: 'warning',
    success: 'check-circle'
  };
  modalRef!: NzModalRef;
  @ViewChild(NzSelectComponent) nzSelectComponent: NzSelectComponent;
  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;

  constructor(
    private inj: Injector,
    private dataService: DataService,
    private modal: NzModalService,
    private sessionService: SessionService,
    private ref: ChangeDetectorRef
  ) {
    this.valueSearch.pipe(
      debounceTime(500)
    ).subscribe((value: string) => {
      for (const elementsByClassNameElement of document.getElementsByClassName('ant-select-selection-search-input') as any) {
        if (elementsByClassNameElement.value) {
          elementsByClassNameElement.value = elementsByClassNameElement.value.trim();
          this.nzSelectComponent.onInputValueChange(elementsByClassNameElement.value);
        }
      }
      if (this.isLoadMore && this._valueSearch !== value.trim()) {
        this.fetchedPages = new Set();
        this._changeSearch = true;
        if (!this.nzSelectComponent?.nzOpen) {
          this.dataSelects = [];
        }
        this._valueSearch = value.trim();
        this.loadMore();
      }
      this.ref.detectChanges();
    });
  }

  @HostListener('keydown.enter', ['$event'])
  handEnter() {
    if (!this.disable) this.onGetDataListAction();
  }

  @HostListener('input', ['$event'])
  handInput() {
    if (!this.disable) this.onGetDataListAction();
  }

  @HostListener('click', ['$event'])
  handClick() {
    if (!this.disable) this.onGetDataListAction();
  }

  onGetDataListAction() {
    if (this.isSearchAfterAction) {
      this.isSearchAfterAction = false;
      this.onGetDataList();
    }
  }

  onGetDataList() {
    if (!this.isLoadMore) {
      this.getDataSelect(this.cacheGetRequest);
    } else {
      this.fetchedPages = new Set();
      this._changeSearch = true;
      if (!this.nzSelectComponent?.nzOpen) {
        this.dataSelects = [];
      }
      this._valueSearch = '';
      this.loadMore();
    }
  }

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
    const validEntries = Object.entries(this.inputParam).filter(([key, value]) => value == null && value === '');
    if (!this.isSearchAfterAction && this.urlLoadData && !this.isLoadMore && this.isLoadData && (!this.isRequiredInputParam || validEntries.length === 0)) {
      this.getDataSelect(this.cacheGetRequest);
    } else {
      if (this.defaultData?.length > 0 && this.isSearchAfterAction) {
        this.dataSelects = this.defaultData;
      } else {
        this.dataSelects = this.dataSelects ?? [];
      }
    }
    this.checkShowAddCategory();
    this.ref.detectChanges();
  }

  // ngDoCheck() {
  //   if (!this.isEmitInitData && this.dataSelects.length > 0 && this.listOfSelectedValue) {
  //     this.isEmitInitData = true;
  //     const emit = new SelectCheckAbleModal('SUBMIT', this.listOfSelectedValue?.length === this.dataSelects?.length, this.listOfSelectedValue);
  //     this.listOfSelectedValue.forEach(item => {
  //       const it = this.dataSelects ? this.dataSelects[this.dataSelects.findIndex(i => i[this.keyValue] === item)] : {};
  //       emit.listItemSelected.push(it);
  //     });
  //     this.eventEmit.emit(emit);
  //   }
  // }

  checkShowAddCategory() {
    if (this.showAddCategory === undefined && this.urlLoadData) {
      this.showAddCategory = this.urlLoadData.includes(UrlConstant.CATEGORIES.GET_LIST + '/');
    }
    this.showAddCategory = this.showAddCategory && this.sessionService.getSessionData(`FUNCTION_${FunctionCode.SYS_CATEGORIES}`)?.create;
    this.ref.detectChanges();
  }

  getDataSelect(cacheGetRequest = true) {
    const validEntries = Object.entries(this.inputParam).filter(([key, value]) => value == null || value === '');
    if (!this.isRequiredInputParam || validEntries.length === 0) {
      this.dataService.getData(this.urlLoadData, this.serviceName, cacheGetRequest, this.inputParam).subscribe(res => {
        this.dataSelects = this.isLoadMore ? res.data.listData : res.data;
        this.ref.detectChanges();
      });
    }
  }

  loadMore(): void {
    const validEntries = Object.entries(this.inputParam).filter(([key, value]) => value == null || value === '');
    if ((!this._changeSearch && this.getPageForIndex() > Math.round(this.total / this.pageSize)) || (this.isRequiredInputParam && validEntries.length > 0)) {
      return;
    }
    const endPage = this._changeSearch ? 0 : this.getPageForIndex();
    this.getData(endPage + 1);
  }

  getData(page) {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);
    this.isLoadMoreLoading = true;
    const params: any = new Pagination().getPage(page, this.pageSize);
    if (this.listOfSelectedValue && this.listOfSelectedValue.length > 0) {
      params.selectedValue = this.listOfSelectedValue.join(',');
    }
    params.keySearch = this._valueSearch;
    params.functionCode = this.functionCode ? this.functionCode : '';
    params.scope = this.scope ? this.scope : '';
    params.status = this.empStatus;
    if (this.valueFilter) {
      params.valueFilter = this.valueFilter;
    }
    const countItemSelectByKey = this.dataSelects.filter(el => {
      return (!this._valueSearch || el[this.keyLabel].toLowerCase().indexOf(this._valueSearch.toLowerCase()) !== -1) && this.listOfSelectedValue?.includes(el[this.keyValue]);
    }).length;
    this.dataService.getDataLoadMore(this.urlLoadData, { ...params, ...this.inputParam }, this.serviceName)
      .pipe(
        catchError(() => {
          this.fetchedPages.delete(page);
          return of([]);
        }),
        map((res: BaseResponse<any>) => {
          this.fetchedPages.add(page);
          this.total = res.data.total ?? 0;
          return res.data.listData ?? [];
        })
      ).subscribe(data => {
      this.isLoadMoreLoading = false;
      if (page === 1 || this._changeSearch || (countItemSelectByKey / this.pageSize) > page) {
        if (page === 1 || this._changeSearch) {
          this.dataSelects = data;
        } else {
          this.dataSelects?.splice(page * this.pageSize, this.pageSize, ...data);
        }
        this._changeSearch = false;
        this.loadMore();
      } else {
        this.dataSelects?.splice(page * this.pageSize, this.pageSize, ...data);
      }
      this.ref.detectChanges();
    });
  }

  private getPageForIndex(): number {
    return Math.floor(this.dataSelects.length / this.pageSize);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputParam']) {
      this.onGetDataList();
    }
    this.configInput();
    this.setErrorMessage();
    if (!changes['errors'] && this.listOfSelectedValue) {
      const emit = new SelectCheckAbleModal('SUBMIT', this.listOfSelectedValue?.length === this.dataSelects?.length, this.listOfSelectedValue);
      this.listOfSelectedValue.forEach(item => {
        const it = this.dataSelects ? this.dataSelects[this.dataSelects.findIndex(i => i[this.keyValue] === item)] : {};
        emit.listItemSelected.push(it);
      });
      this.eventEmit.emit(emit);
      if (this.dataSelects) {
        this.isEmitInitData = true;
      }
      this.ref.detectChanges();
    }
    if (changes.urlLoadData && !changes.urlLoadData.firstChange && this.urlLoadData && !this.isLoadMore) {
      this.getDataSelect(this.cacheGetRequest);
      this.ref.detectChanges();
    }
  }

  configInput() {
    this.inputGroupGroupClass = 'select__group--group' + ' ';
    this.inputMessageClass = 'select__message ' + ' ';
    switch (this.type) {
      case 'default':
        this.inputGroupGroupClass += this.classGroupGroup.default;
        this.inputMessageClass += this.classMessage.default;
        break;
      case 'warning':
        this.inputGroupGroupClass += this.classGroupGroup.warning;
        this.inputMessageClass += this.classMessage.warning;
        this.iconType = this.classIcon.warning;
        break;
      case 'error':
        this.inputGroupGroupClass += this.classGroupGroup.error;
        this.inputMessageClass += this.classMessage.error;
        this.iconType = this.classIcon.error;
        break;
      case 'success':
        this.inputGroupGroupClass += this.classGroupGroup.success;
        this.inputMessageClass += this.classMessage.success;
        this.iconType = this.classIcon.success;
        break;
      default:
        this.inputGroupGroupClass += this.classGroupGroup.default;
        this.inputMessageClass += this.classMessage.default;
        break;
    }
    this.ref.detectChanges();
  }

  setErrorMessage() {
    if (this.errors) {
      for (const error of this.errorDefs) {
        const key = error.errorName;
        if (this.errors[key]) {
          this.textMessageValue = error.errorDescription;
          this.ref.detectChanges();
        }
      }
    }
  }

  checkAll($event: boolean) {
    if ($event) {
      this.listItemSelected = this.dataSelects?.filter(item => item.disable !== true);
      this.listOfSelectedValue = this.dataSelects?.filter(item => item.disable !== true).map((item) => {
        return item[this.keyValue];
      });
    } else {
      this.listItemSelected = this.listItemSelected.filter(el => !this.dataSelects?.map((item) => {
        return item[this.keyValue];
      }).includes(el[this.keyValue]));
      this.listOfSelectedValue = this.listOfSelectedValue.filter(el => !this.dataSelects?.map((item) => {
        return item[this.keyValue];
      }).includes(el));
    }
    const emit = new SelectCheckAbleModal('NG_MODEL_CHANGE', $event, this.listOfSelectedValue, this.listItemSelected, this.checkAllKey);
    this.onChange(this.listOfSelectedValue);
    this.eventEmit.emit(emit);
    this.ref.detectChanges();
  }

  cancel() {
    this.isOpenOptions = false;
    this.listOfSelectedValue = [];
    const emit = new SelectCheckAbleModal('CANCEL');
    this.onChange(this.listOfSelectedValue);
    this.eventEmit.emit(emit);
    this.ref.detectChanges();
  }

  submit() {
    this.isOpenOptions = false;
    const emit = new SelectCheckAbleModal('SUBMIT', this.listOfSelectedValue?.length === this.dataSelects.length, this.listOfSelectedValue);
    this.listOfSelectedValue.forEach(item => {
      const it = this.dataSelects ? this.dataSelects[this.dataSelects.findIndex(i => i[this.keyValue] === item)] : {};
      emit.listItemSelected.push(it);
    });
    this.onChange(this.listOfSelectedValue);
    this.eventEmit.emit(emit);
    this.ref.detectChanges();
  }

  checkItem($event: boolean, value: any) {
    let dataSelectedValue = Object.assign([], this.listOfSelectedValue);
    let dataSelected = Object.assign([], this.listItemSelected);
    if ($event) {
      dataSelectedValue.push(value[this.keyValue]);
      dataSelected.push(value);
    } else {
      dataSelectedValue = dataSelectedValue.filter(item => item !== value[this.keyValue]);
      dataSelected = dataSelected.filter(item => item[this.keyValue] !== value[this.keyValue]);
    }
    this.listOfSelectedValue = dataSelectedValue;
    this.listItemSelected = dataSelected;
    const emit = new SelectCheckAbleModal('NG_MODEL_CHANGE', this.listOfSelectedValue?.length === this.dataSelects.length, this.listOfSelectedValue, this.listItemSelected, value[this.keyValue] + '');
    this.onChange(this.listOfSelectedValue);
    this.eventEmit.emit(emit);
    this.ref.detectChanges();
  }

  selectItem($event: any) {
    this.onChange($event);
    const emit = new SelectCheckAbleModal('NG_MODEL_CHANGE', this.listOfSelectedValue?.length === this.dataSelects.length, this.listOfSelectedValue, this.listItemSelected, 'UNDEFINED');
    this.listOfSelectedValue.forEach(item => {
      const it = this.dataSelects ? this.dataSelects[this.dataSelects.findIndex(i => i[this.keyValue] === item)] : {};
      emit.listItemSelected.push(it);
    });
    this.onChange(this.listOfSelectedValue);
    this.eventEmit.emit(emit);
    this.ref.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.ref.detectChanges();
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    this.ref.detectChanges();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
    this.ref.detectChanges();
  }

  writeValue(obj: any): void {
    this.listOfSelectedValue = obj;
    this.onChange(this.listOfSelectedValue);
    this.values.push(this.listOfSelectedValue);
    if (!this.isSearchAfterAction) {
      if (this.urlLoadData && this.isLoadMore && this.values.length > 1 && this.isLoadData) {
        this.fetchedPages = new Set();
        this._changeSearch = true;
        if (!this.nzSelectComponent?.nzOpen) {
          this.dataSelects = [];
        }
        this.loadMore();
      } else {
        if (this.urlLoadData && this.isLoadMore && this.formMode === Mode.ADD && this.isLoadData) {
          this.loadMore();
        }
      }
    } else if (obj && obj.length > 0) {
      if (this.urlLoadData && this.isLoadData && this.isLoadMore) {
        this.fetchedPages = new Set();
        this._changeSearch = true;
        if (!this.nzSelectComponent?.nzOpen) {
          this.dataSelects = [];
        }
        this.loadMore();
      }
    }
    this.ref.detectChanges();
  }

  onSearch($event: string) {
    this.valueSearch.next($event);
    this.onSearchEvent.emit($event);
  }

  openAddCategory() {
    if (this.showAddCategory) {
      let categoryTypeCode = '';
      if (this.categoryTypeCode) {
        categoryTypeCode = this.categoryTypeCode;
      } else {
        const lastIndex = this.urlLoadData.lastIndexOf('/');
        categoryTypeCode = this.urlLoadData.substring(lastIndex + 1);
      }
      this.modalRef = this.modal.create({
        nzWidth: (window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5) + 'px',
        nzTitle: '',
        nzContent: CategorySystemFormComponent,
        nzComponentParams: {
          categoryTypeCode
        },
        nzFooter: this.footerTpl
      });
      this.modalRef.afterClose.subscribe((result) => {
          if (result?.refresh) {
            this.getDataSelect(false);
          }
        }
      );
    }
  }

  ngOnDestroy() {
    this.valueSearch.unsubscribe();
  }

  focusIn(event: boolean) {
    if (event && !this.dataSelects?.length) {
      this.nzSelectComponent.setOpenState(false);
      this.ref.detectChanges();
    }
  }
}
