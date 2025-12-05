import { TABLE_CONFIG_DEFAULT } from '../constant/common';

export class Pagination {
  pageNumber = 1;
  pageSize: number = TABLE_CONFIG_DEFAULT.pageSize;

  getCurrentPage() {
    return { startRecord: (this.pageNumber - 1) * this.pageSize, pageSize: this.pageSize };
  }

  getPage(pageNumber = 1, pageSize = TABLE_CONFIG_DEFAULT.pageSize) {
    return { startRecord: (pageNumber - 1) * pageSize, pageSize };
  }

  getPageSize() {
    return this.pageSize;
  }
}
