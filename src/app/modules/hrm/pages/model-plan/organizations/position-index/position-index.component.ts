import { Component, Injector, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Scopes } from '@core/utils/common-constants';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { BaseListComponent } from '@core/components/base-list.component';
import { PositionsService } from '@app/modules/hrm/data-access/services/model-plan/positions.service';
import {
  PositionFormComponent
} from '@app/modules/hrm/pages/model-plan/organizations/position-form/position-form.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { DataService } from '@shared/services/data.service';
import { UrlConstant } from '@app/shared/constant/url.class';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-position-index',
  templateUrl: './position-index.component.html',
  styleUrls: ['./position-index.component.scss']
})
export class PositionIndexComponent extends BaseListComponent<any> implements OnChanges, OnDestroy {
  @Input() organizationId!: number;
  serviceName = MICRO_SERVICE.HRM;
  functionCode = FunctionCode.SYS_CATEGORIES;
  scope = Scopes.VIEW;
  isHasChildOrg = false;
  listJobType: any[] = [];
  jobTypeValues = Constant.JOB_TYPE_ADD_POSITION;

  constructor(injector: Injector,
              private service: PositionsService,
              private dataService: DataService) {
    super(injector);
    this.initDataSelect();
    this.initForm();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination, '');
    this.isCustomSearch = true;
    this.key = 'positionId';
    this.formConfig = {
      title: 'hrm.modelPlan.label.positionInfo',
      content: PositionFormComponent
    };
    this.pagination.pageSize = 1000;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }

  initForm() {
    this.form = this.fb.group({
      jobType: null,
      organizationId: null
    });
  }

  initDataSelect() {
    if (this.listJobType?.length === 0) {
      this.subscriptions.push(
        this.dataService.getData(this.getUrlCategory(this.categoryCode.LOAI_CHUC_DANH), this.microService.ADMIN).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.listJobType = res.data.filter(item => this.jobTypeValues.includes(item.value?.toUpperCase()));
          }
        })
      );
    }
  }

  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 50,
        rowspan: 2
      },
      {
        title: 'hrm.modelPlan.organizations.jobName',
        thClassList: ['text-center'],
        field: 'name',
        rowspan: 2
      },
      {
        title: 'hrm.modelPlan.organizations.quantity',
        thClassList: ['text-center'],
        field: 'name',
        width: 400,
        colspan: 2,
        child: [
          {
            title: 'hrm.modelPlan.label.positionInfo',
            field: 'quotaNumber',
            tdClassList: ['text-center']
          },
          {
            title: 'hrm.modelPlan.organizations.reality',
            field: 'actualNumber',
            tdClassList: ['text-center']
          }
        ]
      },
      {
        title: 'common.label.createdBy',
        thClassList: ['text-center'],
        field: 'createdBy',
        width: 150,
        rowspan: 2,
        show: false
      },
      {
        title: 'common.label.createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'createdTime',
        width: 120,
        rowspan: 2,
        show: false
      },
      {
        title: 'common.label.modifiedBy',
        thClassList: ['text-center'],
        field: 'modifiedBy',
        width: 150,
        rowspan: 2,
        show: false
      },
      {
        title: 'common.label.modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'modifiedTime',
        width: 120,
        rowspan: 2,
        show: false
      },
      {
        title: '',
        rowspan: 2,
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl
      }
    ];
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          disabled: (evt: any) => {
            return !evt;
          },
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          disabled: (evt: any) => {
            return !evt;
          },
          function: this.deleteItem
        })
      ]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.organizationId) {
      this.checkHasChildOrg(this.organizationId);
      this.search(1);
    }
  }

  override search(page?: number) {
    this.pagination.pageNumber = 1;
    this.tableData = [];
    const listRequest = this.jobTypeValues.map(value => {
      const params = { jobType: value, organizationId: this.organizationId };
      return this.service.getFilterResearch(params, this.pagination.getCurrentPage())
        .pipe(map((res) => res), catchError(() => of(null)));
    });

    this.subscriptions.push(
      forkJoin(listRequest).subscribe(res => {
        res?.forEach((resItem, index: number) => {
          if (resItem.code === HTTP_STATUS_CODE.SUCCESS && resItem.data.listData?.length > 0) {
            this.tableData.push({ isCustomFieldTr: this.listJobType.find(item => item.value?.toUpperCase() === this.jobTypeValues[index])?.name });
            this.tableData = this.tableData.concat(resItem.data.listData);
          }
        });
      })
    );
  }

  checkHasChildOrg(orgId: number) {
    this.subscriptions.push(
      this.dataService.getData(UrlConstant.ORGANIZATIONS.LOAD_CHILDREN + '/' + orgId, MICRO_SERVICE.HRM).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.isHasChildOrg = res.data.length > 0;
        }
      })
    );
  }

}
