import {FileAttach} from "@shared/model/file-attach.model";

export class PaymentsModel {

  paymentId?: number;
  orderId?: number;
  orderName?: string;
  paymentDate?: string;
  amount?: string;
  paymentMethod?: string;
  paymentType?: string;
  accountNo?: string;
  bankName?: string;
  bankFee?: string;
  note?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}


