import { TemplateRef } from '@angular/core';
import { IHbtOption } from '@core/models/IOption';

export class HBTTableHeader {
  title?: string;
  titleTrans?: string;
  isCheckBox?: boolean;
  field?: string;  // Trường dữ liệu map với backend
  fieldType?: 'tagColor' | 'listTag' | 'pipe' | 'tdTemplate'; //tag status / Trường hợp dữ liệu BE trả ra là 1 list oject hiển thị danh sách theo fieldValue
  fieldTypeValue?: { [key: string]: IHbtOption<number | string> } | string | any;  //
  rowspan?: number;
  colspan?: number;
  fixed?: boolean;
  remove?: boolean;
  fixedDir?: 'left' | 'right';
  width?: number;
  show?: boolean;
  needEllipsis?: boolean;
  needBreakword?: boolean;
  tdClassList?: string[];           // class thẻ TD
  thClassList?: string[];           // class thẻ TH
  thTemplate?: TemplateRef<any>;    // th TemplateRef
  thFilter?: boolean;    // th TemplateRef
  filterKeyName?: string;
  filterType?: 'number' | 'text' | 'date' | 'select' | 'multiSelect';    // th TemplateRef
  filterUrl?: string;    // th TemplateRef
  isExpand?: boolean;    // th TemplateRef
  child?: HBTTableHeader[];
}

export class HBTTableConfig {
  headers: HBTTableHeader[];
  pageIndex?: number;
  pageSize?: number;
  total?: number;
  loading?: boolean;
  needScroll?: boolean;
  size?: 'small' | 'middle' | 'default' = 'default';
  showFrontPagination?: boolean = false;
  showSelect?: boolean = false;
  key?: string = 'id';
}

export abstract class HBTTableComponentToken {
  tableConfig!: HBTTableConfig;
  tableHeader!: Array<Array<HBTTableConfig>>;
  setOfCheckedId: Set<number>;

  abstract tableChangeDetection(): void;
}

export interface SortFile {
  fileName: string;
  sortDir: undefined | 'desc' | 'asc';
}
