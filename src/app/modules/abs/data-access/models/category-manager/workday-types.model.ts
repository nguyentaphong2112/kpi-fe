import {FileAttach} from "@shared/model/file-attach.model";

export class WorkdayTypesModel {

  workdayTypeId?: number;
  code?: string;
  name?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}


