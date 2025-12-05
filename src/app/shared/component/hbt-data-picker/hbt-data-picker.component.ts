import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Pagination } from '@shared/model/pagination';
import { noop, Subscription } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { BaseComponent } from '@core/components/base.component';
import { DataService } from '@shared/services/data.service';
import { UrlConstant } from '@shared/constant/url.class';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { Mode } from '@shared/constant/common';
import { BaseResponse } from '@core/models/base-response';
import _ from 'lodash';
import { ValidateService } from '@shared/services/common-utils.service';
import {HbtSelectComponent, SelectModal} from '@shared/component/hbt-select/select.component';
import {SelectAbleComponent} from "@shared/component/hbt-select-able/select-able.component";

@Component({
  selector: 'hbt-data-picker',
  templateUrl: './hbt-data-picker.component.html',
  styleUrls: ['./hbt-data-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HbtDataPickerComponent)
    }
  ]
})
export class HbtDataPickerComponent extends BaseComponent implements OnInit, ControlValueAccessor, OnDestroy, OnChanges {

  @ViewChild(HbtSelectComponent) select!: HbtSelectComponent;
  @ViewChild(SelectAbleComponent) selectAble!: SelectAbleComponent;

  constructor(
    private inj: Injector,
    private modalService: NzModalService,
    public validateService: ValidateService,
    private dataService: DataService
  ) {
    super(inj);
  }

  @Input() urlLoadData: string = UrlConstant.EMPLOYEES.PREFIX + UrlConstant.EMPLOYEES.DATA_PICKER;
  @Input() serviceName: string = MICRO_SERVICE.HRM;
  @Input() keyLabel = 'label';
  @Input() keyValue = 'employeeId';
  @Input() placeholder = 'Nhân viên';
  @Input() isMulti = false;
  value: any;
  itemSelectedValue: any = null;
  @Input() labelText: string;
  @Input() disable = false;
  @Input() formMode: Mode = Mode.ADD;
  @Input() tableSetting: { label: string, value: string }[] = [];
  @Input() selected: Record<string, any>;
  @Input() errorDefs: { errorName: string, errorDescription: string }[];
  @Input() showError = false;
  @Input() errors: any;
  @Input() type: 'default' | 'warning' | 'error' | 'success' = 'default';
  @Input() modalWidth: number = window.innerWidth > 767 ? window.innerWidth / 1.5 : window.innerWidth;
  @Output() selectedChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() labelSearch = this.translate.instant('common.label.keySearch');
  @Input() inputParam = {};
  @Input() isRequiredInputParam = false;

  data: Record<string, any>[] = [];
  count = 0;
  onTouched: () => void = noop;
  onChange: (_: any) => void = noop;
  ngControl?: NgControl;
  subs: Subscription[] = [];
  keyWordSearch: string = null;

  pagination = new Pagination();

  @ViewChild('dataTable') dataTable: TemplateRef<any>;
  public modalRef: NzModalRef;

  checkboxAllValueMap: Map<number, boolean> = new Map();
  checkboxAllIndeterminateMap: Map<number, boolean> = new Map();

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
    this.onInputChange = _.debounce(this.onInputChange, 200);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputParam'] && (this.selectAble || this.select)) {
      if (this.isMulti) {
        this.selectAble.onGetDataList();
      } else {
        this.select.onGetDataList();
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  getEmployeeData(keyword: string, pageNumber: number) {
    const validEntries = Object.entries(this.inputParam).filter(([key, value]) => value == null && value === '');
    if (!this.isRequiredInputParam || validEntries.length === 0) {
      this.pagination.pageNumber = pageNumber;
      const param: any = this.pagination.getCurrentPage();
      param.keySearch = keyword ? keyword.trim() : '';
      param.selectedValue = this.isMulti && this.value ? this.value.join(',') : this.value;
      this.dataService.getDataLoadMore(this.urlLoadData, {...param, ...this.inputParam}, this.serviceName).subscribe((res: BaseResponse<any>) => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.data = res.data.listData;
          this.count = res.data.total;
        }
      }, () => this.data = []);
    }
  }

  onInputChange(value: string): void {
    this.resetDataSearch();
    if (value && value.length > 1) {
      this.getEmployeeData(value, 1);
    }
  }

  selectItem(data: Record<string, any>) {
    if (this.isMulti) {
      this.writeValue([...new Set([...(this.value ?? []), data[this.keyValue]])]);
      this.onChange([...new Set([...(this.value ?? []), data[this.keyValue]])]);
      this.refreshStatus();
    } else {
      const emit = new SelectModal('NG_MODEL_CHANGE', this.itemSelectedValue);
      emit.itemSelected = data;
      this.selectedChange.emit(emit);
      this.writeValue(data[this.keyValue]);
      this.onChange(data[this.keyValue]);
      this.refreshStatus();
      this.closeModal();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.onChange(this.value);
  }

  emitData($event) {
    this.selectedChange.emit($event);
  }

  public resetDataSearch() {
    this.data = [];
    this.count = 0;
    this.pagination = new Pagination();
    this.pagination.pageNumber = 1;
  }

  openModal() {
    this.resetDataSearch();
    this.modalRef = this.modalService.create({
      nzWidth: this.modalWidth,
      nzClosable: null,
      nzBodyStyle: { padding: '5px' },
      nzContent: this.dataTable,
      nzFooter: null
    });
    this.getEmployeeData('', 1);
  }

  closeModal() {
    this.modalRef.destroy();
  }

  onAllChecked(value: boolean) {
    const listId = this.data.map(item => item[this.keyValue]);
    if (value) {
      this.checkboxAllValueMap.set(this.pagination.pageNumber, true);
      this.value = [...new Set([...(this.value ?? []), ...listId])];
    } else {
      this.checkboxAllValueMap.delete(this.pagination.pageNumber);
      this.value = this.value?.filter(id => !listId.includes(id));
    }
    this.refreshStatus();
  }

  onItemChecked(idChange: any, value: boolean) {
    if (value) {
      this.value = [...new Set([...(this.value ?? []), idChange])];
    } else {
      this.value = this.value?.filter(id => id !== idChange);
    }
    this.refreshStatus();
  }


  refreshStatus() {
    const allCheck = this.data.every(item => this.value.includes(item[this.keyValue]));
    const allUnCheck = this.data.every(item => !this.value.includes(item[this.keyValue]));
    const indeterminate = !allCheck && !allUnCheck;
    this.checkboxAllValueMap.set(this.pagination.pageNumber, allCheck);
    this.checkboxAllIndeterminateMap.set(this.pagination.pageNumber, indeterminate);
    const emit = new SelectModal('NG_MODEL_CHANGE', this.itemSelectedValue);
    emit.itemSelected = this.value;
    emit.listOfSelected = this.value;
    emit.listItemSelected = this.data.filter(el => this.value.includes(el[this.keyValue]));
    this.selectedChange.emit(emit);
    this.writeValue(this.value);
    this.onChange(this.value);
  }
}
