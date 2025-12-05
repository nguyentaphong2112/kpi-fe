import { FileAttach } from '@shared/model/file-attach.model';

export class CustomerCertificatesModel {

  customerCertificateId?: number;
  customerId?: number;
  customerName?: string;
  certificateId?: string;
  issuedDate?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  statusId?: string;
  approvedNote?: string;
}


