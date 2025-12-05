import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {LogActionsService} from "@app/modules/crm/data-access/services/category-managers/logActions.service";
import {Constant} from "@app/modules/library/data-access/constants/constants";
import {BaseListComponent} from "@core/components/base-list.component";
import {NzSafeAny} from "ng-zorro-antd/core/types";

@Component({
  selector: 'payments-form',
  templateUrl: './log-action-form.component.html',
  styleUrls: ['./log-action-form.component.scss']
})
export class LogActionFormComponent extends BaseListComponent<NzSafeAny> implements OnInit {

  serviceName = MICRO_SERVICE.CRM
  hasDataId = false;
  data: any;

  @ViewChild('contentChangeTmpl', { static: true }) contentChangeTmpl!: TemplateRef<any>;

  constructor(
    private readonly service: LogActionsService,
    injector: Injector
  ) {
    super(injector);
    this.isCustomSearch = true;
    this.key = 'logActionId'
  }

  ngOnInit() {
    super.ngOnInit();
    this.initDataTable();
  }

  initDataTable(page?: number) {
    this.pagination.pageNumber = page ?? 1;
    this.hasDataId = !!this.data.id;
    if (this.hasDataId) {
      this.service.getFilterResearch({ objId: this.data.id, listObjType: this.data.listObjType }, null)
        .subscribe(res => {
          this.tableData = res.data?.listData?.map(item => {
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
          this.tableConfig.total = res.data.total;
          this.tableConfig.pageIndex = res.data.pageIndex;
        });
    }
  }


  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 60
      },
      {
        title: 'crm.logActions.table.actionName',
        field: 'actionName',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 100
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
        title: 'crm.logActions.table.objName',
        field: 'objName',
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.logActions.table.createdTime',
        field: 'createdTime',
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      }
    ];
  }

}


