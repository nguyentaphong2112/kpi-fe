import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
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
import { noop, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { Category } from '../../model/category';
import { Pagination } from '../../model/pagination';
import { EmployeeDetail } from '../../model/personal-info';
import { StaffInfoService } from '../../services/staff-info.service';
import { BaseResponse } from '@core/models/base-response';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { DataService } from '@shared/services/data.service';
import { BaseComponent } from '@core/components/base.component';
import { UrlConstant } from '@shared/constant/url.class';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Mode } from '@shared/constant/common';
import { SelectCheckAbleModal } from '@shared/component/hbt-select-able/select-able.component';

@Component({
  selector: 'employee-data-picker',
  templateUrl: './employee-data-picker.component.html',
  styleUrls: ['./employee-data-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => EmployeeDataPickerComponent)
    }
  ]
})
export class EmployeeDataPickerComponent extends BaseComponent implements OnInit, ControlValueAccessor, OnDestroy, OnChanges {

  constructor(
    private inj: Injector,
    private staffService: StaffInfoService,
    private modalService: NzModalService,
    private dataService: DataService
  ) {
    super(inj);
  }

  @Input() urlLoadData: string = UrlConstant.EMPLOYEES.PREFIX + UrlConstant.EMPLOYEES.DATA_PICKER;
  @Input() serviceName: string = MICRO_SERVICE.HRM;
  @Input() dataSelect = [];
  @Input() keyLabel = 'label';
  @Input() keyValue = 'employeeId';
  @Input() defaultData = [];
  @Input() isSearchAfterAction = false;
  @Input() placeholder = 'Nhân viên';
  @Input() isMulti = false;
  value: any;
  valueCustom: any;
  @Input() labelText: string;
  @Input() disable = false;
  @Input() formMode: Mode = Mode.ADD;
  @Input() selected: EmployeeDetail;
  @Input() errorDefs: { errorName: string, errorDescription: string }[];
  @Input() showError = false;
  @Input() isExpand = false;
  @Input() errors: any;
  @Input() type: 'default' | 'warning' | 'error' | 'success' = 'default';
  @Input() status: 'ALL' | 'ACTIVE' | 'WORKING';
  @Input() scope: string;
  @Input() functionCode: string;
  @Input() modalWidth: number = window.innerWidth > 767 ? window.innerWidth / 1.2 : window.innerWidth;
  @Output() selectedChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() isLoadData = true;
  @Input() isIcon = false;
  @Input() isChoose = false;

  empTypeId: string = null;
  empTypeCodeList: Category[] = [];
  data: EmployeeDetail[] = [];
  listDataChecked = [];
  listDataSelected = [];
  count = 0;
  onTouched: () => void = noop;
  onChange: (_: any) => void = noop;
  ngControl?: NgControl;
  avtBase64Default = 'data:image/png;base64,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';
  subs: Subscription[] = [];
  listAvatar: any[] = [];
  listIsLoading: boolean[] = [];
  selectedNode!: any;
  keyWordSearch: string = null;

  pagination = new Pagination();

  @ViewChild('dataTable') dataTable: TemplateRef<any>;
  public modalRef: NzModalRef;

  checkboxAllValueMap: Map<number, boolean> = new Map();
  checkboxAllIndeterminateMap: Map<number, boolean> = new Map();

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
    if (this.isLoadData) {
      this.onInputChange = _.debounce(this.onInputChange, 200);
    }
  }

  onChangeValue() {
    if (this.isMulti) {
      const emit = new SelectCheckAbleModal('SUBMIT', this.value?.length === this.data?.length, this.value);
      this.listDataChecked = this.listDataChecked.filter(el => this.value.includes(el[this.keyValue]));
      const data = _.clone(this.listDataChecked);
      if (this.listDataSelected) {
        this.listDataSelected.forEach(it => {
          if (!data.some(itChild => itChild[this.keyValue] == it[this.keyValue]) && this.value.includes(it[this.keyValue])) {
            data.push(it);
          }
        });
      }
      emit.listItemSelected.push(...data);
      this.selectedChange.emit(emit);
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoadData'] && !changes['isLoadData'].previousValue && changes['isLoadData'].currentValue && !changes['isLoadData'].firstChange) {
      this.onInputChange = _.debounce(this.onInputChange, 200);
    }
  }

  ngOnDestroy(): void {
    this.listAvatar = [];
    this.listIsLoading = [];
    this.subs.forEach(sub => sub.unsubscribe());
  }

  selectNode(node: any) {
    this.selectedNode = node;
    this.getEmployeeData(this.keyWordSearch, 1);
  }

  eventEmitChange($event) {
    this.listDataSelected = $event.listItemSelected ?? [];
  }

  getEmployeeData(keyword: string, pageNumber: number) {
    this.pagination.pageNumber = pageNumber;
    const param: any = this.pagination.getCurrentPage();
    param.keySearch = keyword ? keyword.trim() : '';
    param.selectedValue = this.isMulti && this.value ? this.value.join(',') : this.value;
    param.empTypeId = this.empTypeId ? this.empTypeId : '';
    param.functionCode = this.functionCode ? this.functionCode : '';
    param.scope = this.scope ? this.scope : '';
    param.status = this.status;
    param.organizationId = this.selectedNode?.id ? this.selectedNode?.id : null;
    this.listAvatar = [];
    this.listIsLoading = [];
    this.staffService.getEmployeeData(param).subscribe((res: BaseResponse<any>) => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.data = res.data.listData;
        this.count = res.data.total;
        this.getListAvatar();
      }
    }, () => this.data = []);
  }

  onInputChange(value: string): void {
    this.resetDataSearch();
    if (value && value.length > 1) {
      this.getEmployeeData(value, 1);
    }
  }

  getEmpTypeCodes() {
    this.dataService.getData(UrlConstant.GET_EMP_TYPE, MICRO_SERVICE.HRM).subscribe((res: BaseResponse<any>) => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.empTypeCodeList = res.data;
      }
    });
  }

  selectItem(personalInfo: EmployeeDetail) {
    if (this.isMulti) {
      if (!this.isChoose) {
        this.writeValue([...new Set([...(this.value ?? []), personalInfo[this.keyValue]])]);
        this.onChange([...new Set([...(this.value ?? []), personalInfo[this.keyValue]])]);
        this.refreshStatus();
      } else {
        this.valueCustom = [...new Set([...(this.valueCustom ?? []), personalInfo[this.keyValue]])];
        this.onChange([...new Set([...(this.valueCustom ?? []), personalInfo[this.keyValue]])]);
      }
    } else {
      this.writeValue(personalInfo[this.keyValue]);
      this.onChange(personalInfo[this.keyValue]);
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
    setTimeout(() => {
      this.onChangeValue();
      this.ref.detectChanges();
    });
    this.ref.detectChanges();
  }

  getListAvatar() {
    this.data?.forEach((item, index) => {
      this.getAvatar(item.employeeId, index);
    });
  }

  getAvatar(employeeId: number, index: number) {
    this.listIsLoading[index] = true;
    this.subs.push(
      this.dataService.getDataLoadMore(`/employees/avatar/${employeeId}`, null, MICRO_SERVICE.HRM).subscribe(res => {
        this.listAvatar[index] = res?.data ? ('data:image/jpg;base64,' + res?.data) : this.avtBase64Default;
        this.listIsLoading[index] = false;
      }, () => {
        this.listAvatar[index] = this.avtBase64Default;
        this.listIsLoading[index] = false;
      })
    );
  }

  public resetDataSearch() {
    this.data = [];
    this.count = 0;
    this.pagination = new Pagination();
    this.pagination.pageNumber = 1;
  }

  openModal() {
    this.getEmpTypeCodes();
    if (this.isIcon) {
      this.isLoadData = true;
    }
    this.resetDataSearch();
    this.modalRef = this.modalService.create({
      nzWidth: this.modalWidth,
      nzClosable: null,
      nzBodyStyle: { padding: '0' },
      nzContent: this.dataTable,
      nzFooter: null
    });
    if (this.isChoose) {
      this.valueCustom = this.value;
    }
    this.getEmployeeData('', 1);
  }

  closeModal() {
    this.modalRef.destroy();
  }

  select() {
    this.value = this.valueCustom;
    this.refreshStatus();
    this.closeModal();
  }

  onAllChecked(value: boolean) {
    const listId = this.data.map(item => item[this.keyValue]);
    if (value) {
      this.checkboxAllValueMap.set(this.pagination.pageNumber, true);
      if (this.isChoose) {
        this.valueCustom = [...new Set([...(this.valueCustom ?? []), ...listId])];
      } else {
        this.value = [...new Set([...(this.value ?? []), ...listId])];
      }
      this.data.forEach(it => {
        if (!this.listDataChecked.some(itChild => itChild[this.keyValue] == it[this.keyValue])) {
          this.listDataChecked.push(it);
        }
      });
    } else {
      this.checkboxAllValueMap.delete(this.pagination.pageNumber);
      if (this.isChoose) {
        this.valueCustom = this.valueCustom?.filter(id => !listId.includes(id));
      } else {
        this.value = this.value?.filter(id => !listId.includes(id));
      }
      this.listDataChecked.filter(it => !listId.includes(it[this.keyValue]));
    }
    if (!this.isChoose) {
      this.refreshStatus();
    }
  }

  onItemChecked(idChange: any, value: boolean, data: any) {
    if (value) {
      if (this.isChoose) {
        this.valueCustom = [...new Set([...(this.valueCustom ?? []), idChange])];
      } else {
        this.value = [...new Set([...(this.value ?? []), idChange])];
      }
      this.listDataChecked.push(data);
    } else {
      if (this.isChoose) {
        this.valueCustom = this.valueCustom?.filter(id => id !== idChange);
      } else {
        this.value = this.value?.filter(id => id !== idChange);
      }
      this.listDataChecked.filter(it => it[this.keyValue] !== idChange);
    }
    if (!this.isChoose) {
      this.refreshStatus();
    }
  }


  refreshStatus() {
    const allCheck = this.data.every(item => this.value.includes(item[this.keyValue]));
    const allUnCheck = this.data.every(item => !this.value.includes(item[this.keyValue]));
    const indeterminate = !allCheck && !allUnCheck;
    this.checkboxAllValueMap.set(this.pagination.pageNumber, allCheck);
    this.checkboxAllIndeterminateMap.set(this.pagination.pageNumber, indeterminate);
    this.writeValue(this.value);
    this.onChange(this.value);
  }

}
