export class CardTemplatesModel {
  id?: number;
  cardTemplateId?: number;
  templateType?: string;
  title?: string;
  defaultParameters?: any[];
  parameters?: any[];
  isApplyAll?: string;
  listParameter?: any[];
  listDefaultParameter?: any[];
  attachFileList?: any[];
  data: any;
  files: any;
}