import { FileAttach } from '@shared/model/file-attach.model';

export class PaymentsModel {

  paymentId?: number;
  orderId?: number;
  orderName?: string;
  paymentDate?: string;
  amount?: number;
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
  introducerName?: string;
  welfareRecipientName?: string;
  caregiverName?: string;  
  employeeId?: number;
  paymentTypeName?: string;
  paymentMethodName?: string;
  fullName?: string;
  customerName?: string;
}


