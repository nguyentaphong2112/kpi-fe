import { NzSafeAny } from 'ng-zorro-antd/core/types';

export interface WarningConfig {
  apiUri: string;
  backgroundColor: string;
  icon: string;
  isMustPositive: string;
  orderNumber: string;
  resource: string;
  sqlQuery: string;
  title: string;
  urlViewDetail: string;
  warningConfigId: string;
  isPopup: boolean;
  isShowExcel: boolean;
  listColumnTable: NzSafeAny;
}