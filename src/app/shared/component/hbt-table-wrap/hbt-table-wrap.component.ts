import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StringUtils } from '../../utils/string-utils.class';
import { HBTTableComponentToken, HBTTableHeader } from '../hbt-table/hbt-table.interfaces';
import { _variable } from '@core/global-style/_variable';

@Component({
  selector: 'hbt-table-wrap',
  templateUrl: './hbt-table-wrap.component.html',
  styleUrls: ['./hbt-table-wrap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HbtTableWrapComponent implements OnInit, AfterContentInit, OnChanges, AfterContentChecked {
  @Input() title;
  @Input() extra = true;
  @Input() tableConfig;
  @ContentChild(HBTTableComponentToken) antTableComponent!: HBTTableComponentToken;
  currentTableComponent!: HBTTableComponentToken;
  tableHeaders: HBTTableHeader[] = [];
  tableHeadersSource: HBTTableHeader[] = [];
  copyHeader: HBTTableHeader[] = [];
  curAmountSelectedRows: number;
  columnSearch: string;
  tableConfigVisible = false;
  allTableFieldChecked = false;
  allTableFieldIndeterminate = false;

  _variable = _variable;
  constructor(
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.title = this.title ?? this.translate.instant('common.label.searchResult');
    this.translate.onLangChange.subscribe(res => this.configHBTTableHeader());
  }

  ngAfterContentChecked() {
    this.curAmountSelectedRows = this.antTableComponent.setOfCheckedId.size;
    this.cdRef.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableConfig) {
      this.tableHeaders = this.tableConfig.headers.filter(item => item.remove !== true);
      this.copyHeader = [];
      this.tableHeaders.forEach(item => {
        this.copyHeader.push({ ...item });
      });
      this.tableHeaders.forEach(item => {
        if (item.show === undefined) {
          item.show = true;
        }
      });
      this.configHBTTableHeader();
      this.judgeAllChecked();
    }
  }

  ngAfterContentInit(): void {
    this.currentTableComponent = this.antTableComponent;
    this.tableHeaders = this.currentTableComponent.tableConfig.headers.filter(item => item.remove !== true);
    this.tableHeaders.forEach(item => {
      if (item.show === undefined) {
        item.show = true;
      }
    });
    this.configHBTTableHeader();
    this.judgeAllChecked();
  }

  traverseToSetTitleTrans(item: HBTTableHeader) {
    item.titleTrans = item.title ? this.translate.instant(item.title) : '';
    for (const node of item.child || []) {
      this.traverseToSetTitleTrans(node);
    }
    return null;
  }

  configHBTTableHeader() {
    for (let i = 0; i < this.tableHeaders.length; i++) {
      const header = this.tableHeaders[i];
      this.traverseToSetTitleTrans(header);
    }
    this.copyHeader.length = 0;
    this.tableHeaders.forEach(item => {
      this.copyHeader.push({ ...item });
    });
    this.tableHeadersSource = [...this.tableHeaders];
  }

  changeSignalCheck(e: boolean, item: HBTTableHeader): void {
    if (item?.child && item?.child?.length > 0) {
      this.traverseToHideOrUnHideColumn(item, e);
    } else {
      item.show = e;
    }
    this.judgeAllChecked();
    this.tableChangeDetection();
  }

  traverseToHideOrUnHideColumn(item: HBTTableHeader, isShow: boolean) {
    if (item.title === 'STT') {
      return;
    }
    item.show = isShow;
    for (const node of item.child || []) {
      this.traverseToHideOrUnHideColumn(node, isShow);
    }
    return null;
  }

  tableChangeDetection() {
    this.currentTableComponent.tableChangeDetection();
  }

  judgeAllChecked(): void {
    this.allTableFieldChecked = this.tableHeaders.every(item => item.show === true);
    const allUnChecked = this.tableHeaders.every(item => !item.show);
    this.allTableFieldIndeterminate = !this.allTableFieldChecked && !allUnChecked;
  }

  reset(): void {
    this.columnSearch = null;
    this.tableHeaders = [];
    this.copyHeader.forEach(item => {
      item.child?.forEach(child => {
        if (item.show === true || item.show === undefined) {
          child.show = true;
        }
      });
      this.tableHeaders.push({ ...item });
    });
    this.tableHeadersSource = [...this.tableHeaders];
    this.currentTableComponent.tableConfig.headers = [...this.tableHeaders];
    this.tableChangeDetection();
  }

  changeAllTableTableConfigShow(e: boolean): void {
    if (e) {
      this.allTableFieldChecked = e;
      this.allTableFieldIndeterminate = false;
    }
    this.tableHeaders.forEach(item => this.traverseToHideOrUnHideColumn(item, e));
    this.tableHeadersSource = [...this.tableHeaders];
    this.tableChangeDetection();
  }

  searchColumn() {
    if (!StringUtils.isNullOrEmpty(this.columnSearch)) {
      this.tableHeaders = this.tableHeadersSource.filter(item => item.titleTrans.toLowerCase().includes(this.columnSearch.toLowerCase()));
    } else {
      this.tableHeaders = [...this.tableHeadersSource];
    }
  }
}
