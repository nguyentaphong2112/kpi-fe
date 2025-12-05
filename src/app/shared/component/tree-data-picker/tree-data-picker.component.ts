import { Component, EventEmitter, forwardRef, Injector, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { noop, Subscription } from 'rxjs';
import { ValidateService } from '../../services/common-utils.service';
import { Pagination } from '../../model/pagination';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@app/core/constant/system.constants';
import { BaseResponse } from '@core/models/base-response';
import { UrlConstant } from '@shared/constant/url.class';
import { DataService } from '@shared/services/data.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { HbtTreeSelectComponent } from '@shared/component/hbt-tree-select/hbt-tree-select.component';
import { _variable } from '@core/global-style/_variable';

export class DataConfig {
  titleTree?: string;
  titleHeader?: string;
  domainName?: string;
  parentName?: string;
}

@Component({
  selector: 'tree-data-picker',
  templateUrl: './tree-data-picker.component.html',
  styleUrls: ['./tree-data-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TreeDataPickerComponent),
    }
  ]})
export class TreeDataPickerComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() dataConfig: DataConfig = {
    titleTree: 'common.organization.treeOrg',
    titleHeader: 'common.organization.org',
    domainName: 'common.organization.name',
    parentName: 'common.organization.orgManagement'
  };
  @Input() isOnlyId = true;
  @Input() checkStrictly = true;
  @Input() labelText: string;
  @Input() placeholder: string;
  @Input() scope: string;
  @Input() functionCode: string;
  @Input() disable = false;
  @Input() selected: any;
  @Input() canText = false;
  @Input() errorDefs: {errorName: string, errorDescription: string}[];
  @Input() showError = false;
  @Input() errors: any;
  @Input() type: 'default' | 'warning' | 'error' | 'success' = 'default';
  @Input() required = false;
  @Input() isMultiSelect = false;
  @Input() isExpand = false;
  @Input() keyValue = 'nodeId';
  @Input() keyLabel = 'name';
  @Input() urlLoadDataNode = UrlConstant.ORGANIZATIONS.LOAD_NODE;
  @Input() urlLoadChildren = UrlConstant.ORGANIZATIONS.LOAD_CHILDREN;
  @Input() urlSearch = UrlConstant.ORGANIZATIONS.SEARCH;
  @Input() serviceName = MICRO_SERVICE.HRM;
  @Input() modalWidth: number = window.innerWidth > 767 ? window.innerWidth / 1.2 : window.innerWidth;
  @Output() selectedChange = new EventEmitter<any>();

  @ViewChild('dataTableModalTmpl') dataTableModal: TemplateRef<NzSafeAny>;
  @ViewChild('treeSelectTmpl') treeSelectComponent: HbtTreeSelectComponent;
  data: any[] = [];
  count = 0;
  orgSearchValue: string;
  selectedNode: any = null;
  modalRef: NzModalRef;
  pagination = new Pagination();
  listDataSelected: any[] = [];
  form: FormGroup;
  subs: Subscription[] = [];
  onTouched: () => void = noop;
  onChange: (_: any) => void = noop;
  ngControl?: NgControl;

  _variable = _variable;
  constructor(
    private inj: Injector,
    private orgService: DataService,
    public validateService: ValidateService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
    this.form = this.fb.group({
      inputSearch: [null]
    });
  }

  get f() {
    return this.form?.controls;
  }

  openModal() {
    this.modalRef = this.modalService.create({
      nzWidth: this.modalWidth,
      nzClosable: null,
      nzBodyStyle: { padding: '0' },
      nzTitle: '',
      nzContent: this.dataTableModal,
      nzFooter: null
    });
    this.doSearchOrg();
    this.listDataSelected = this.selected ?? [];
  }

  doSelectOrg(data: any) {
    if (!this.isMultiSelect) {
      this.selected = data;
      this.updateTreeSelect([data]);
      this.onChangeFormValue([data]);
      this.closeModal();
    } else {
      const checkCur = this.getCheckedItem(data);
      this.onCheckChange(!checkCur, data);
    }
  }

  doSearchOrg() {
    this.pagination.pageNumber = 1;
    this.getByParent();
  }

  selectNode(node: any) {
    this.pagination.pageNumber = 1;
    this.selectedNode = node;
    this.getByParent();
  }

  getByParent() {
    const param = {
      ...this.pagination.getCurrentPage(),
      keySearch: this.orgSearchValue ?? '',
      scope: this.scope ?? '',
      functionCode: this.functionCode ?? '',
      organizationId: this.selectedNode?.id ?? '',
      parentKey: this.selectedNode?.id ?? ''
    };

    this.subs.push(
      this.orgService.getDataByParam(this.urlSearch, param, this.serviceName).subscribe((res: BaseResponse<any>) => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.data = res.data.listData.map(item => {
            item[this.keyValue] = item[this.keyValue]?.toString();
            return item;
          });
          this.count = res.data.total;
        }
      })
    );
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
    this.treeSelectComponent?.setDisabledState(isDisabled);
  }

  writeValue(data: any): void {
    if (data) {
      const listData = this.isMultiSelect ? data : [data];
      if (this.isOnlyId && listData?.length > 0) {
        this.dataService.getDataLoadMore(UrlConstant.ORGANIZATIONS.GET_BY_LIST_ID,  {listId: listData}, this.serviceName).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.updateTreeSelect(res.data);
          }
        });
      } else {
        this.updateTreeSelect(listData);
      }
    }
  }

  updateTreeSelect(data: any[]) {
    if (data?.length > 0) {
      this.selected = data;
      this.treeSelectComponent?.setDefaultDataSelect(this.selected);
      const formValue = data?.map(item => item[this.keyValue]?.toString());
      this.f.inputSearch?.setValue(this.isMultiSelect ? formValue : formValue[0]);
    }
  }

  onChangeFormValue(data: any[]) {
    const fromValue = this.isOnlyId ? data?.map(item => item[this.keyValue]) : data;
    this.onChange(this.isMultiSelect ? fromValue : fromValue[0]);

  }

  onCheckAll(checked: boolean) {
    if (checked) {
      const selectedValue = new Set(this.listDataSelected.map(item => item[this.keyValue]));
      this.data.forEach(item => {
        if (!selectedValue.has(item[this.keyValue])) {
          this.listDataSelected.push(item);
        }
      });
    } else {
      const selectedValue = new Set(this.data.map(item => item[this.keyValue]));
      this.listDataSelected = this.listDataSelected.filter(item => !selectedValue.has(item[this.keyValue]));
    }
  }

  onCheckChange(checked: boolean, data: any) {
    if (checked) {
      this.listDataSelected.push(data);
    } else {
      this.listDataSelected = this.listDataSelected.filter(item => item[this.keyValue] !== data[this.keyValue]);
    }
  }

  doChooseOrg() {
    this.selected = this.listDataSelected;
    this.selectedChange.emit(this.selected);
    this.onChangeFormValue(this.selected);
    this.updateTreeSelect(this.selected);
    this.closeModal();
  }

  eventEmitChange(event) {
    this.selected = event?.listOfSelected ? event?.listOfSelected : [];
    const data = this.isMultiSelect ? this.selected : this.selected[0];
    this.f.inputSearch?.setValue(this.isMultiSelect ? data.map(item => item.key) : data?.key);
    this.selectedChange.emit(data);
    this.onChangeFormValue(this.selected);
  }

  getCheckedItem(data: any): boolean {
    return this.listDataSelected?.some(item => item[this.keyValue] === data[this.keyValue]);
  }

  getCheckAll(): boolean {
    const listValue = new Set(this.listDataSelected?.map(item => item[this.keyValue] ?? []));
    return this.data?.length > 0 &&  this.data.every(item => listValue.has(item[this.keyValue]));
  }

  closeModal() {
    this.selectedNode = null;
    this.orgSearchValue = '';
    this.pagination.pageNumber = 1;
    this.modalRef?.destroy();
  }

  ngOnDestroy(): void {
    this.subs?.forEach(sub => sub.unsubscribe());
    this.modalRef?.destroy();
  }

}
