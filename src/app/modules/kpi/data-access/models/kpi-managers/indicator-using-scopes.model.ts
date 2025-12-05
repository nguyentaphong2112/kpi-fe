import {FileAttach} from "@shared/model/file-attach.model";

export class IndicatorUsingScopesModel {

  indicatorUsingId?: number;
  indicatorUsingName?: string;
  indicatorId?: number;
  indicatorName?: string;
  organizationId?: number;
  organizationName?: string;
  positionId?: number;
  positionName?: string;
  jobId?: number;
  jobName?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}


