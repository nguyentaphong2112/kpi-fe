import { FileAttach } from '@shared/model/file-attach.model';

export class FeedbackModel {
  feedbackId?: number;
  userId?: number;
  content?: string;
  objectId?: string;
  functionCode?: string;
  createdTime?: Date | string;
  createdBy?: string;
  status?: string;
  statusName?: string;
  loginName?: string;
  fullName?: string;
  employeeCode?: string;
  orgName?: string;
  jobName?: string;
  typeName?: string;
  attachFileList?: Array<FileAttach>;
  comments?: any[];
}