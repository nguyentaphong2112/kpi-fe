import {FileAttach} from "@shared/model/file-attach.model";

export class ProductsModel {

  productId?: number;
  code?: string;
  name?: string;
  unitId?: string;
  unitPrice?: string;
  categoryId?: string;
  isDeleted?: string;
  createdBy?: string;
  createdTime?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  lastUpdateTime?: string;
  attachFileList?: Array<FileAttach>;
  docIdsDelete?: number[];
}


