import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { ValidateService } from '../../services/common-utils.service';
import {
  HBTTableComponentToken,
  HBTTableConfig,
  HBTTableHeader
} from '@shared/component/hbt-table/hbt-table.interfaces';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'hbt-table',
  templateUrl: './hbt-table.component.html',
  styleUrls: ['./hbt-table.component.scss', '../../../core/global-style/_table.scss'],
  providers: [
    { provide: HBTTableComponentToken, useExisting: HbtTableComponent }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HbtTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() showExtra = true;
  @Input() tableConfig: HBTTableConfig;
  @Input() dataList: readonly NzSafeAny[];
  @Input() showRangeTotal = true;
  @Input() isScrollY = true;
  tableHeader: Array<Array<HBTTableHeader>>;
  tableHeaderMappingWithBe: Array<HBTTableHeader>;
  nzScrollWidth: number;
  currentPageIndex = 1;
  currentDataTable: NzSafeAny[];
  setOfCheckedId = new Set<number>();
  checkboxAllValueMap: Map<number, boolean> = new Map();
  checkboxAllIndeterminateMap: Map<number, boolean> = new Map();
  @Input() @InputBoolean() showSizeChanger = false;
  @Input() @InputBoolean() showQuickJumper = false;
  @Input() rangeTotalTemplate: TemplateRef<any>;
  @Output() changePageNum = new EventEmitter<number>();
  @Output() changePageSize = new EventEmitter<number>();
  @Output() onDblClick = new EventEmitter<NzSafeAny>();
  @Output() onDownLoadFile = new EventEmitter<NzSafeAny>();
  @Output() amountSelectedRowsChange = new EventEmitter<Array<number>>();
  @Input() selectedRowsId = [];
  @Input() objFilter: any;
  @Output() objFilterChange = new EventEmitter<any>();
  @Output() changeMapData = new EventEmitter<NzSafeAny>();
  isShowFilter = false;
  isHoveredLeft = false;
  isHoveredRight = false;
  valPageNavigated = '';
  listIndexTrCustom: number[] = [];
  nzWidthConfig: string[] = [];
  mapData: Map<NzSafeAny, NzSafeAny> = new Map();

  filterObs = new Subject();
  objFilterOld = {};

  constructor(
    private cdRef: ChangeDetectorRef,
    public validateService: ValidateService,
    private toastService: ToastrService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.preprocessTableHeader();
    this.selectedRowsId.forEach((rowId) => {
      if (rowId !== null && rowId !== undefined) {
        this.onItemChecked({ [this.tableConfig.key]: rowId }, true);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.filterObs.pipe(debounceTime(500)).subscribe(value => {
        if (!this.deepEqual(value, this.objFilterOld)) {
          this.objFilterChange.emit(value);
          this.objFilterOld = value;
        }
      });
    }, 5);
  }

  deepEqual(objLeft: any, objRight: any) {
    if (objLeft === objRight) return true;

    if (typeof objLeft !== 'object' || typeof objRight !== 'object' || objLeft == null || objRight == null) {
      return false;
    }

    const arrKeys = Object.keys(objLeft);

    for (const key of arrKeys) {
      if (!this.deepEqual(objLeft[key], objRight[key])) {
        return false;
      }
    }

    return true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableConfig) {
      this.preprocessTableHeader();
    }
    this.listIndexTrCustom = this.dataList?.map((item, index) => {
      if (item?.isCustomFieldTr) {
        return index;
      }
    });
  }

  resetAllCheckBoxFn() {
    this.checkboxAllValueMap.clear();
    this.checkboxAllIndeterminateMap.clear();
    this.setOfCheckedId.clear();
    this.mapData.clear();
    this.cdRef.detectChanges();
  }

  tableChangeDetection(): void {
    // this.dataList = [...this.dataList];
    this.preprocessTableHeader();
    this.cdRef.detectChanges();
  }

  private preprocessTableHeader() {
    if (this.showExtra && !this.tableConfig?.headers?.some(item => item.title === '' || item.field === 'action')) {
      this.tableConfig.headers?.push({
        title: '',
        field: 'extra',
        width: 35,
        fieldType: 'tdTemplate',
        fixed: true,
        fixedDir: 'right'
      });
    }
    const tree = {
      title: null,
      child: this.tableConfig.headers.filter(item => item.remove !== true)
    };
    const result = this.walkTree(tree);
    result.shift();
    this.tableHeader = result;
    this.tableHeaderMappingWithBe = this.getTableHeaderMappingWithBe([tree]);
    if (this.tableConfig.showSelect) {
      const rowspan = this.tableHeader[0][0].rowspan;  // lay row span cua stt
      this.tableHeader[0].unshift({ rowspan, width: 50, isCheckBox: true });
      this.tableHeaderMappingWithBe.unshift({ width: 50 });
    }
    this.setScrollWidth();
  }

  getColSpanCustomField(): number {
    return this.tableHeaderMappingWithBe?.filter(item => item.show !== false)?.length - 1;
  }

  private walkTree(tree, level = 0, collection = []) {
    const c = tree.child;
    const v = tree;
    if (!Array.isArray(collection[level])) {
      collection[level] = [];
    }
    collection[level].push(v);
    for (const subTree of c || []) {
      collection = this.walkTree(subTree, level + 1, collection);
    }
    return collection;
  }

  private getTableHeaderMappingWithBe(nodes, result = []) {
    for (let i = 0, length = nodes.length; i < length; i++) {
      if (!nodes[i].child || nodes[i].child.length === 0) {
        result.push(nodes[i]);
      } else {
        result = this.getTableHeaderMappingWithBe(nodes[i].child, result);
      }
    }
    return result;
  }

  onPageIndexChange(event: number): void {
    this.changePageNum.emit(event);
    this.currentPageIndex = event;
  }

  onPageSizeChange($event: number): void {
    this.changePageSize.emit($event);
  }

  setScrollWidth() {
    this.nzScrollWidth = 0;
    this.nzWidthConfig = [];
    for (const item of this.tableHeaderMappingWithBe) {
      if (item.show === undefined || item.show === true) {
        item.width = item.width ?? 150;
        this.nzScrollWidth += item.width;
        this.nzWidthConfig.push(item.width + 'px');
      }
    }
  }

  onItemChecked(rowData: NzSafeAny, event: boolean) {
    if (event) {
      this.setOfCheckedId.add(rowData[this.tableConfig.key]);
      this.mapData.set(rowData[this.tableConfig.key], rowData);
    } else {
      this.setOfCheckedId.delete(rowData[this.tableConfig.key]);
      this.mapData.delete(rowData[this.tableConfig.key]);
    }
    this.refreshStatus();
  }

  refreshStatus() {
    const validData = this.currentDataTable?.filter(item => !item.disabled).map(item => item[this.tableConfig.key]);
    const allCheck = validData?.every(id => this.setOfCheckedId.has(id));
    const allUnCheck = validData?.every(id => !this.setOfCheckedId.has(id));
    const indeterminate = !allCheck && !allUnCheck;
    this.checkboxAllValueMap.set(this.currentPageIndex, allCheck);
    this.checkboxAllIndeterminateMap.set(this.currentPageIndex, indeterminate);
    this.onAmountSelectedRowsChange();
  }

  onAmountSelectedRowsChange() {
    this.amountSelectedRowsChange.emit(Array.from(this.setOfCheckedId));
    this.changeMapData.emit(this.mapData);
  }

  onAllChecked(value: boolean) {
    const validData = this.currentDataTable.filter(item => !item.disabled).map(item => item[this.tableConfig.key]);
    if (value) {
      this.checkboxAllValueMap.set(this.currentPageIndex, true);
      validData.forEach(id => {
        this.setOfCheckedId.add(id);
        this.mapData.set(id, this.dataList.find(item => item[this.tableConfig.key] === id));
      });

    } else {
      this.checkboxAllValueMap.delete(this.currentPageIndex);
      validData.forEach(id => {
        this.setOfCheckedId.delete(id);
        this.mapData.delete(id);
      });
    }
    this.refreshStatus();
  }

  currentPageDataChange(event: NzSafeAny[]): void {
    this.currentDataTable = event;
  }

  onDetail(data: NzSafeAny) {
    this.onDblClick.emit(data);
  }

  getRow(row: any, rowIndex: number) {
    return { ...row, data: row, rowIndex };
  }

  isDisableAll() {
    return !this.dataList.every(el => !el.disabled);
  }

  handlePageNavigated() {
    if (!this.valPageNavigated) {
      this.toastService.error(this.translate.instant('common.paging.requiredValPage'));
      return;
    }
    if (!this.isNumeric(this.valPageNavigated)) {
      this.toastService.error(this.translate.instant('common.paging.valNotValid'));
      return;
    }
    if (Number(this.valPageNavigated) > this.calculateNumPages() || Number(this.valPageNavigated) < 1) {
      this.toastService.error(this.translate.instant('common.paging.rangePageValid'));
      return;
    }
    this.onPageIndexChange(Number(this.valPageNavigated));
    this.tableConfig.pageIndex = Number(this.valPageNavigated);
    setTimeout(() => {
      this.valPageNavigated = '';
    }, 10);
  }

  isNumeric(str: string): boolean {
    if (typeof str !== 'string') {
      return false;
    } // chỉ xử lý chuỗi
    return !isNaN(str as any) && !isNaN(parseFloat(str));
  }

  calculateNumPages(): number {
    return Math.ceil(this.tableConfig.total / this.tableConfig.pageSize);
  }

  doDownLoadFile(file: any) {
    this.onDownLoadFile.emit(file);
  }


  onFilterChange() {
    this.filterObs.next(this.objFilter);
  }
}
