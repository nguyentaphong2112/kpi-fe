import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { LogActionService } from '@app/modules/crm/data-access/services/cskh/log-action.service';
import { LogActionModel } from '@app/modules/crm/data-access/models/order-managers/log-action.model';

@Component({
  selector: 'app-log-action',
  templateUrl: './log-action.component.html',
  styleUrls: ['./log-action.component.scss']
})
export class LogActionComponent extends BaseListComponent<LogActionModel> implements OnInit {
  @ViewChild('contentChangeTmpl', { static: true }) contentChangeTmpl!: TemplateRef<any>;
  data: any;
  constructor(
    injector: Injector,
    private readonly service: LogActionService
  ) {
    super(injector);
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.serviceName = MICRO_SERVICE.CRM;
    this.key = 'orderId';
  }

  ngOnInit() {
    this.initFormSearch();
    super.ngOnInit();
  }

  initFormSearch() {
    this.form = this.fb.group({
      loginName: [this.data.loginName],
      objType: [null]
    });
  }

  override beforeExport() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData = this.responseSearch.data.listData.map(item => {
      const dataBeforeArr = item.dataBefore ? item.dataBefore.split('\n') : [];
      const dataAfterArr = item.dataAfter ? item.dataAfter.split('\n') : [];

      const contentChange = dataBeforeArr.map((before, index) => {
        const after = dataAfterArr[index] || '';
        const keyBefore = before.split(':')[0] || '';
        const valueBefore = before.split(':')[1] || '';
        const valueAfter = after.split(':')[1] || '';

        if (valueBefore && valueAfter && valueBefore !== valueAfter) {
          return {
            keyBefore,
            valueBefore: valueBefore.trim(),
            valueAfter: valueAfter.trim(),
          };
        }
        return null;
      }).filter(change => change !== null);

      return {
        ...item,
        contentChange
      };
    });
  }

  override setHeaders() {
    this.tableConfig.key = this.key;
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
        title: 'crm.log-action.table.actionName',
        field: 'actionName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.logActions.table.contentChange',
        field: 'contentChange',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.contentChangeTmpl,
        tdClassList: ['text-left'],
        thClassList: ['text-left'],
      },
      {
        title: 'crm.log-action.table.objName',
        field: 'objName',
        width: 150,
      },
      {
        title: 'crm.log-action.table.createdByName',
        field: 'createdByName',
        width: 120,
      }
    ];
  }


}

