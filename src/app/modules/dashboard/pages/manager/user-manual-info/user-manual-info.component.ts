import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '@core/components/base.component';
import { DocumentInfo } from '@app/modules/dashboard/data-access/models/document-info';
import {ExportReportService} from "@app/modules/crm/data-access/services/export-report/export-report.service";
import {DynamicReportService} from "@app/modules/admin/data-access/services/configurations/dynamic-report.service";

@Component({
  selector: 'app-user-manual-info',
  templateUrl: './user-manual-info.component.html',
  styleUrls: ['./user-manual-info.component.scss']
})
export class UserManualInfoComponent extends BaseComponent implements OnInit {
  arrDocument: DocumentInfo[] = [];
  arrDocumentAll: DocumentInfo[] = [
    { id: 1, reportCode: 'HDSD_DANH_GIA_KPI_CBNV', name: 'Hướng dẫn sử dụng đánh giá KPI - vai trò CBNV' },
    { id: 2, reportCode: 'HDSD_DANH_GIA_KPI_QLDV', name: 'Hướng dẫn sử dụng đánh giá KPI - vai trò QL đơn vị' },

  ];
  isHideBottom = false;

  constructor(injector: Injector, private readonly dynamicReportService:DynamicReportService) {
    super(injector);
  }

  ngOnInit(): void {
    this.arrDocument = this.arrDocumentAll.slice(0, 7);
  }

  openLink(item: DocumentInfo) {
    this.dynamicReportService.exportByReportCode({isPreview:"false"},item.reportCode).toPromise();
  }

  loadMore() {
    const listOther = this.arrDocumentAll.filter(el => !this.arrDocument.map(e => e.id).includes(el.id));
    if (listOther.length > 0) {
      this.arrDocument.push(...listOther.slice(0, 5));
    } else {
      this.isHideBottom = true;
    }
  }
}
