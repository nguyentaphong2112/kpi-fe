import { FileAttach } from '@shared/model/file-attach.model';
import { Validators } from '@angular/forms';

export class IndicatorConversionsModel {

  indicatorConversionId?: number;
  indicatorId?: number;
  indicatorName?: string;
  orgTypeId?: number;
  organizationId?: number;
  jobId?: number;
  note?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
  status?: string;
}


