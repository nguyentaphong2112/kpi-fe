import {FileAttach} from "@shared/model/file-attach.model";

export class ReasonTypesModel {

  reasonTypeId?: number;
  code?: string;
  name?: string;
  workdayTypeId?: number;
  workdayTypeName?: string;
  defaultTimeOff?: number;
  defaultTimeOffType?: string;
  maxTimeOff?: number;
  yearMaxTimeOffType?: string;
  maxTimeOffType?: string;
  yearMaxTimeOff?: string;
  isOverHoliday?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}


