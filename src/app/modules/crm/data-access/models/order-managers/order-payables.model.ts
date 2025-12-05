import { FileAttach } from '@shared/model/file-attach.model';


export class OrderPayablesModel {

  orderPayableId?: number;
  orderId?: number;
  orderName?: string;
  productId?: number;
  productName?: string;
  customerId?: number;
  customerName?: string;
  periodDate?: string;
  referralFee?: number;
  careFee?: number;
  orderAmount?: number;
  welfareFee?: number;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  statusId?: string;
  id?: number;
  approvedNote?: string;
}


