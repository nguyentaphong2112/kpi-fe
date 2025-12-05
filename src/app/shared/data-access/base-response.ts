import {NzSafeAny} from "ng-zorro-antd/core/types";

export interface BaseResponse<T = NzSafeAny> {
  code?: number | string;
  statusCode?: number | string;
  message?: string;
  timestamp?: string;
  clientMessageId?: string;
  transactionId?: string;
  path?: string;
  status?: number;
  data?: T;
  body?: T;
}