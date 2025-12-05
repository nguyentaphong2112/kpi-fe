export class BaseResponse<T> {
  code: number | string;
  message: string;
  timestamp: string;
  clientMessageId: string;
  transactionId: string;
  path: string;
  status: number;
  data: any | T | Pageable<T>;
}

export interface Pageable<T> {
  pageIndex: number;
  total: number;
  listData: T[];
}
