import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { DynamicReportService } from '@app/modules/admin/data-access/services/configurations/dynamic-report.service';
import { DrsFormComponent } from '@app/modules/admin/pages/configurations/dynamic-reports/drs-form/drs-form.component';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-drs-index',
  templateUrl: './drs-index.component.html',
  styleUrls: ['./drs-index.component.scss']
})
export class DrsIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = FunctionCode.SYS_DYNAMIC_REPORT;

  constructor(injector: Injector,
              private dynamicReportService: DynamicReportService) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.dynamicReportService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.dynamicReportService.getFilterResearch(body, pagination);
    this.formConfig = {
      title: 'admin.configurations.dynamicReports.label.dynamicReport',
      content: DrsFormComponent
    };
    this.addWidth = 200;
    this.key = 'dynamicReportId';
  }



  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }


  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null
    });
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteItem
        })
      ]
    });
  }

  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50
      },
      {
        title: 'admin.configurations.dynamicReports.table.name',
        field: 'name',
        thClassList: ['text-center']
      },
      {
        title: 'admin.configurations.dynamicReports.table.code',
        thClassList: ['text-center'],
        field: 'code'
      },
      {
        title: 'admin.configurations.dynamicReports.table.reportType',
        thClassList: ['text-center'],
        field: 'reportType'
      },
      {
        title: 'admin.configurations.dynamicReports.table.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'admin.configurations.dynamicReports.table.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'admin.configurations.dynamicReports.table.modifiedTime',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'admin.configurations.dynamicReports.table.modifiedBy',
        field: 'modifiedBy',
        thClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 80,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }

}
