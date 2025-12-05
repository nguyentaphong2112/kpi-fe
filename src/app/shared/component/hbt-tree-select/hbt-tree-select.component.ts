import {
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { SelectModal } from '@shared/component/hbt-select/select.component';
import { noop, Subscription } from 'rxjs';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { DataService } from '@shared/services/data.service';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { NzFormatEmitEvent } from 'ng-zorro-antd/core/tree/nz-tree-base.definitions';

@Component({
  selector: 'hbt-tree-select',
  templateUrl: './hbt-tree-select.component.html',
  styleUrls: ['./hbt-tree-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HbtTreeSelectComponent)
    }
  ]
})
export class HbtTreeSelectComponent implements OnInit, OnChanges, OnDestroy {
  @Input() cacheGetRequest = true;
  @Input() customIconSearch: TemplateRef<any> | null = null;
  @Input() functionCode = '';
  @Input() scope = '';
  @Input() urlLoadData = '';
  @Input() urlLoadChildren = '';
  @Input() listDataChecked: any[] = [];
  @Input() serviceName = '';
  @Input() dataSelects: NzTreeNodeOptions[] = [];
  @Input() required = true;
  @Input() showSearch = true;
  @Input() checkAble = false;
  @Input() asyncData = false;
  @Input() checkStrictly = false;
  @Input() @InputBoolean() disable = false;
  @Input() @InputBoolean() serverSearch = false;
  @Input() placeholder = '';
  @Input() dropdownClassName = '';
  @Input() selectIcon!: 'search' | 'down' | string;
  @Input() optionHeightPx = 56;
  @Input() optionOverflowSize = 5;
  @Input() labelText!: string;
  @Input() keyLabel = 'name';
  @Input() keyValue = 'value';
  @Input() @InputBoolean() keyValueStringType = false;
  @Input() errorDefs!: { errorName: string, errorDescription: string }[];
  @Input() showIconMessage = true;
  @Input() showError = false;
  @Input() errors: NzSafeAny;
  @Input() type: 'default' | 'warning' | 'error' | 'success' = 'default';
  @Input() isLoading = false;
  @Input() showClear = true;
  @Input() mode: 'multiple' | 'default' = 'default';
  @Input() isExpand = false;
  @Output() eventEmit: EventEmitter<SelectModal> = new EventEmitter<SelectModal>();
  @Output() eventSelect: EventEmitter<SelectModal> = new EventEmitter<SelectModal>();
  @Output() select: EventEmitter<NzSafeAny> = new EventEmitter<NzSafeAny>();
  @Output() onSearch: EventEmitter<NzSafeAny> = new EventEmitter<NzSafeAny>();
  itemSelectedValue: NzSafeAny = null;
  subs: Subscription[] = [];
  onTouched: () => void = noop;
  onChange: (_: NzSafeAny) => void = noop;
  ngControl?: NgControl;
  inputMessageClass = 'input__message';
  textMessageValue: NzSafeAny;
  showIcon: NzSafeAny;
  iconType: NzSafeAny;
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
    error: 'close-circle',
    success: 'check-circle'
  };
  @ViewChild(NzSelectComponent) nzSelectComponent!: NzSelectComponent;

  constructor(
    private inj: Injector,
    private dataService: DataService
  ) {
  }

  ngOnChanges() {
    this.configInput();
    this.setErrorMessage();
  }

  setDefaultDataSelect(listDataChecked: any[]) {
    if (listDataChecked?.length > 0 && this.dataSelects.length > 0 && this.asyncData) {
      listDataChecked.forEach(item => {
        if (item[this.keyValue]) {
          const node = this.dataSelects.find(v => v.key === item[this.keyValue]?.toString());
          if (!node) {
            item.checked = true;
            item.selected = true;
            item.isLeaf = true;
            item.key = item[this.keyValue]?.toString();
            item.title = item[this.keyLabel];
            this.dataSelects.push(item);
          } else {
            node.checked = true;
            node.selected = true;
          }
        }
      });
    }
  }

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
    if (this.urlLoadData) {
      const params = { functionCode: this.functionCode ?? '', scope: this.scope ?? '' };
      this.subs.push(
        this.dataService.getDataByParam(this.urlLoadData, params, this.serviceName, this.cacheGetRequest, 60, true).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.dataSelects = this.getDataSelect(res.data);
            if (this.isExpand) {
              this.dataSelects.forEach(item => {
                this.dataService.getDataByParam(this.urlLoadChildren + '/' + item.key, null, this.serviceName, this.cacheGetRequest, 60, true).subscribe(res => {
                  if (res.code === HTTP_STATUS_CODE.SUCCESS) {
                    item.expanded = true;
                    item.children = this.getDataSelect(res.data);
                  }
                });
              });
            }
            this.setDefaultDataSelect(this.listDataChecked);
          }
        })
      );
    }
  }

  getDataSelect(data: NzTreeNodeOptions[]): NzTreeNodeOptions[] {
    return data?.map((item: NzTreeNodeOptions) => {
      item.title = item[this.keyLabel];
      item.key = item[this.keyValue]?.toString();
      if (this.itemSelectedValue?.includes(item.key)) {
        item.checked = this.checkAble;
        item.selected = !this.checkAble;
      }
      item.children = this.getDataSelect(item.children);
      return item;
    });
  }

  onExpandChange(event: NzFormatEmitEvent) {
    if (this.asyncData) {
      this.loadChildrenData(event.node).then();
    }
  }

  async loadChildrenData(node: NzTreeNodeOptions) {
    if (node && node.getChildren().length === 0 && node.isExpanded) {
      const res = await this.dataService.getDataByParam(this.urlLoadChildren + '/' + node.key, null, this.serviceName).toPromise();
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        node.addChildren(this.getDataSelect(res.data));
      }
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
  }

  selectItem(event: NzSafeAny) {
    this.itemSelectedValue = event;
    this.selectedChange(event, this.checkAble ? event : [event]);
  }

  checkBoxChange(event: any) {
    this.itemSelectedValue = event.keys;
    this.selectedChange(event, event.keys);
  }

  selectedChange(data: any, keys: string[]) {
    const listNodes = this.getNodeDataByValue(this.dataSelects, keys);
    this.onChange(this.itemSelectedValue);
    this.select.emit(data);
    const emit = new SelectModal('NG_MODEL_CHANGE', listNodes);
    this.eventEmit.emit(emit);
  }

  getNodeDataByValue(nodes: NzTreeNodeOptions[], values: string[]): NzTreeNodeOptions[] {
    const result: NzTreeNodeOptions[] = [];

    function findNodes(nodes: NzTreeNodeOptions[], values: string[]) {
      for (const node of nodes) {
        if (values.includes(node.key) && !result.some(item => item.key === node.key)) {
          result.push(node);
        } else if (!values.includes(node.key)) {
          node.selected = false;
          node.checked = false;
        }
        if (node.children) {
          findNodes(node.children, values);
        }
      }
    }

    findNodes(nodes, values);
    return result;
  }

  registerOnChange(fn: NzSafeAny): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: NzSafeAny): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  writeValue(obj: NzSafeAny): void {
    this.itemSelectedValue = obj;
    this.onChange(this.itemSelectedValue);
  }

  ngOnDestroy(): void {
    this.subs?.forEach(sub => sub.unsubscribe());
  }
}
