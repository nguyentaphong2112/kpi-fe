import {FileAttach} from "@shared/model/file-attach.model";

export class OvertimeRecordsModel {

  overtimeRecordId?: number;
  id?:number;
  data?:any;
  employeeId?: number;
  employeeName?: string;
  dateTimekeeping?: string;
  startTime?: string;
  endTime?: string;
  totalHours?: string;
  overtimeTypeId?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  listRecords?:Array<any>;
  docIdsDelete?: number[];
}


