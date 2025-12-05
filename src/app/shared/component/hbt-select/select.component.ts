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
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { DataService } from '@shared/services/data.service';
import { Pagination } from '@shared/model/pagination';
import { catchError, map } from 'rxjs/operators';
import { BaseResponse } from '@core/models/base-response';
import { Mode } from '@shared/constant/common';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CategorySystemFormComponent } from '@shared/component/category-system-form/category-system-form.component';
import { SessionService } from '@core/services/session.service';
import { UrlConstant } from '@shared/constant/url.class';
import { FunctionCode } from '@shared/enums/enums-constant';

export class SelectModal {
  action: 'SUBMIT' | 'CANCEL' | 'NG_MODEL_CHANGE';
  isCheckAll = false;
  listOfSelected?: any[] = [];
  itemChecked?: any;
  itemSelected?: any;
  listItemSelected?: any;

  constructor(action?: 'SUBMIT' | 'CANCEL' | 'NG_MODEL_CHANGE', listOfSelected: any = null) {
    this.action = action;
    this.listOfSelected = listOfSelected;
  }
}

@Component({
  selector: 'hbt-select',
  templateUrl: './select.component.html',
  styleUrls: ['../../../core/global-style/_select.scss', 'select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HbtSelectComponent)
    }
  ]
})
export class HbtSelectComponent implements OnInit, ControlValueAccessor, OnChanges, OnDestroy {
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
  @Input() urlLoadData = '';
  @Input() serviceName = MICRO_SERVICE.ADMIN;
  @Input() inputParam = {};
  @Input() isTree = false;
  @Input() keyParent = 'parentId';
  @Input() isRequiredInputParam = false;
  @Input() @InputBoolean() isLoadMore = false;
  @Input() formMode: Mode = Mode.ADD;
  @Input() pageSize = 10;
  @Input() showSearch = true;
  @Input() @InputBoolean() disable = false;
  @Input() @InputBoolean() required = false;
  @Input() placeholder = '';
  @Input() dropdownClassName = '';
  @Input() selectIcon: 'search' | 'down' | string;
  @Input() optionHeightPx = 56;
  @Input() optionOverflowSize = 5;
  @Input() labelText: string;
  @Input() keyLabel = 'label';
  @Input() keyValue = 'value';
  @Input() defaultData = [];
  @Input() isSearchAfterAction = false;
  @Input() @InputBoolean() keyValueStringType = false;
  @Input() errorDefs: { errorName: string, errorDescription: string }[];
  @Input() showIconMessage = true;
  @Input() showError = false;
  @Input() errors: any;
  @Input() type: 'default' | 'warning' | 'error' | 'success' = 'default';
  @Input() isLoading = false;
  @Input() showClear = true;
  @Input() mode: 'multiple' | 'default' = 'default';
  @Input() isLoadData = true;
  @Output() eventEmit: EventEmitter<SelectModal> = new EventEmitter<SelectModal>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearchEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onReloadDataSelect = new EventEmitter<boolean>();
  @Output() dataLoaded = new EventEmitter<any[]>();
  @Input() valueFilter = null;
  itemSelectedValue: any = null;
  isLoadMoreLoading = false;
  private total = 0;
  private fetchedPages = new Set<number>();
  private values = [];
  isOpenOptions = false;
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
  @ViewChild('optionGroupLabel', { static: true }) optionGroupLabel: TemplateRef<void>;

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

  getOptionGroupLabel(dataSelect: any): TemplateRef<void> {
    return this.optionGroupLabel;
  }

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

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
    const validEntries = Object.entries(this.inputParam).filter(([key, value]) => value == null && value === '');
    if ((!this.isSearchAfterAction && this.urlLoadData && !this.isLoadMore && this.isLoadData) && (!this.isRequiredInputParam || validEntries.length === 0)) {
      this.getDataSelect(this.cacheGetRequest);
    } else {
      if (this.defaultData?.length > 0 && this.isSearchAfterAction) {
        this.dataSelects = this.defaultData;
      } else {
        this.dataSelects = this.getDataNotInTree(this.dataSelects);
      }
    }
    this.checkShowAddCategory();
    this.ref.detectChanges();
  }

  getDataNotInTree(data: any[]) {
    if (!data) return [];
    if (!this.isTree) return data;
    const listConfigCode =  this.getChildrenConfigCode(this.inputParam[this.keyValue], data.filter(el => el[this.keyValue]));
    return data.filter((el: any) => !listConfigCode.includes(el[this.keyValue]));
  }

  getChildrenConfigCode(value, data) {
    let children = data.filter(item => value && item[this.keyParent] === value);
    for (const child of children) {
      children = children.concat(this.getChildrenConfigCode(child[this.keyValue], data));
    }
    return children.map(el => el[this.keyValue]);
  }

  // ngDoCheck() {
  //   if (!this.isEmitInitData && this.dataSelects.length > 0 && this.itemSelectedValue) {
  //     this.isEmitInitData = true;
  //     const emit = new SelectModal('NG_MODEL_CHANGE', this.itemSelectedValue);
  //     emit.itemSelected = this.dataSelects ? this.dataSelects[this.dataSelects.findIndex(item => item[this.keyValue] === this.itemSelectedValue)] : {};
  //     this.eventEmit.emit(emit);
  //   }
  // }

  checkShowAddCategory() {
    if (this.showAddCategory === undefined && this.urlLoadData) {
      this.showAddCategory = this.urlLoadData.includes(UrlConstant.CATEGORIES.GET_LIST + '/');
    }
    this.showAddCategory = this.showAddCategory && this.sessionService.getSessionData(`FUNCTION_${FunctionCode.SYS_CATEGORIES}`)?.create;
  }

  getDataSelect(cacheGetRequest = true) {
    const validEntries = Object.entries(this.inputParam).filter(([key, value]) => value == null || value === '');
    if (this.urlLoadData && (!this.isRequiredInputParam || validEntries.length === 0)) {
      this.dataService.getData(this.urlLoadData, this.serviceName, cacheGetRequest, this.inputParam).subscribe(res => {
        this.dataSelects = this.getDataNotInTree(this.isLoadMore ? res.data.listData : res.data);
        this.dataLoaded.emit(this.dataSelects);
        this.ref.detectChanges();
      });
    } else {
      this.dataSelects = [];
      this.writeValue(null);
      this.ref.detectChanges();
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
    if (this.itemSelectedValue) {
      params.selectedValue = [this.itemSelectedValue];
    }
    params.keySearch = this._valueSearch;
    params.functionCode = this.functionCode ? this.functionCode : '';
    params.scope = this.scope ? this.scope : '';
    params.status = this.empStatus;
    if (this.valueFilter) {
      params.valueFilter = this.valueFilter;
    }
    this.dataService.getDataLoadMore(this.urlLoadData, {...params, ...this.inputParam}, this.serviceName)
      .pipe(
        catchError(() => {
          this.fetchedPages.delete(page);
          return of([]);
        }),
        map((res: BaseResponse<any>) => {
          this.total = res.data.total ?? 0;
          return res.data.listData ?? [];
        })
      ).subscribe(data => {
      this.isLoadMoreLoading = false;
      if (page === 1 || this._changeSearch) {
        this._changeSearch = false;
        this.dataSelects = this.getDataNotInTree(data);
        this.loadMore();
      } else {
        this.dataSelects?.splice(page * this.pageSize, this.pageSize, ...data);
        this.dataSelects = this.getDataNotInTree(this.dataSelects);
      }
      this.ref.detectChanges();
    });
  }

  private getPageForIndex(): number {
    return Math.floor(this.dataSelects?.length / this.pageSize);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputParam']) {
      this.onGetDataList();
    }
    this.configInput();
    this.setErrorMessage();
    if (!changes['errors'] && this.itemSelectedValue) {
      const emit = new SelectModal('NG_MODEL_CHANGE', this.itemSelectedValue);
      emit.itemSelected = this.dataSelects ? this.dataSelects[this.dataSelects.findIndex(item => item[this.keyValue] === this.itemSelectedValue)] : {};
      this.eventEmit.emit(emit);
      if (this.dataSelects) {
        this.isEmitInitData = true;
      }
    }
    if (changes.urlLoadData && !changes.urlLoadData.firstChange) {
      this.getDataSelect(this.cacheGetRequest);
    }
    this.ref.detectChanges();
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
  }

  setErrorMessage() {
    if (this.errors) {
      for (const error of this.errorDefs) {
        const key = error.errorName;
        if (this.errors[key]) {
          this.textMessageValue = error.errorDescription;
        }
      }
    }
    this.ref.detectChanges();
  }

  selectItem($event: any) {
    this.onChange($event);
    const emit = new SelectModal('NG_MODEL_CHANGE', this.itemSelectedValue);
    emit.itemSelected = this.dataSelects[this.dataSelects?.findIndex(item => item[this.keyValue] === $event)];
    this.eventEmit.emit(emit);
    if (this.dataSelects) {
      this.isEmitInitData = true;
    }
    this.select.emit(emit);
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
    this.itemSelectedValue = obj;
    this.onChange(this.itemSelectedValue);
    this.values.push(this.itemSelectedValue);
    if (!this.isSearchAfterAction) {
      if (this.urlLoadData && this.isLoadMore && this.values.length > 1 && this.isLoadData) {
        this.fetchedPages = new Set();
        this._changeSearch = true;
        if (!this.nzSelectComponent?.nzOpen) {
          this.dataSelects = [];
        }
        this.loadMore();
      } else {
        if (this.urlLoadData && this.isLoadMore && this.formMode === Mode.ADD && this.isLoadData)  {
          this.loadMore();
        }
      }
    }
    this.ref.detectChanges();
  }

  clearValue() {
    this.nzSelectComponent.clearInput();
    this.ref.detectChanges();
  }

  onSearch($event: string) {
    this.valueSearch.next($event);
    this.onSearchEvent.emit($event);
    this.ref.detectChanges();
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
            if (this.urlLoadData) {
              this.getDataSelect(false);
            } else {
              this.onReloadDataSelect.emit(true);
            }
          }
          this.ref.detectChanges();
        }
      );
    }
  }

  ngOnDestroy() {
    this.valueSearch.unsubscribe();
  }
}
