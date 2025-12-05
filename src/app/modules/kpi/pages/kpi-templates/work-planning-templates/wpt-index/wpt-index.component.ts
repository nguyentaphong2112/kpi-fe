import { Component, HostListener, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkPlanningTemplatesModel } from '../../../../data-access/models/kpi-templates/work-planning-templates.model';
import {
  WorkPlanningTemplatesService
} from '../../../../data-access/services/kpi-templates/work-planning-templates.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { Scopes } from '@core/utils/common-constants';
import { FormGroup, Validators } from '@angular/forms';
import {
  EvaluationResultsService
} from '@app/modules/hrm/data-access/services/staff-research/evaluation-results.service';

@Component({
  selector: 'app-wpt-index',
  templateUrl: './wpt-index.component.html',
  styleUrls: ['./wpt-index.component.scss']
})
export class WptIndexComponent extends BaseListComponent<WorkPlanningTemplatesModel> implements OnInit {
  serviceName = MICRO_SERVICE.KPI;
  functionCode = Constant.FUNCTION_CODE.WORK_PLANNING_TEMPLATE;
  urlLoadData = '/work-planning-templates';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  isVisible = false;
  workPlanningTemplateId = null;
  scope = Scopes.VIEW;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  formExport!: FormGroup;
  listPeriod = [];

  constructor(
    injector: Injector,
    private readonly service: WorkPlanningTemplatesService,
    private readonly evaluationResultsService: EvaluationResultsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.key = 'workPlanningTemplateId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
    this.getListData();
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null]
    });

    this.formExport = this.fb.group({
      periodId: [null, Validators.required],
      organizationIds: [null, Validators.required]
    });
  }

  getListData() {
    this.evaluationResultsService.getList({ evaluationType: 2 }, '/evaluation_periods').subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listPeriod = res.data;
      }
    });
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.view',
          icon: 'eye',
          // isShowFn: this.isShowEdit,
          function: this.doOpenFormDetail
        }),
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          // disabled: (evt: any) => {
          //   return !evt;
          // },
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.export',
          icon: 'upload',
          isShow: true,
          function: (evt: any) => {
            this.exportById(evt.workPlanningTemplateId);
          }
        }),
        new ChildActionSchema({
          label: 'kpi.button.registerExport',
          icon: 'upload',
          isShow: true,
          function: (evt: any) => {
            this.openExport(evt.workPlanningTemplateId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          // isShowFn: this.isShowDelete,
          function: this.deleteItem
        })
      ]
    });
  }

  openExport(id: number) {
    this.isSubmitted = false;
    this.formExport.reset();
    this.isVisible = true;
    this.workPlanningTemplateId = id;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  exportById(id: number, isRegister = false) {
    this.isSubmitted = true;
    if (isRegister && this.formExport.invalid) {
      return;
    }
    this.service.export(isRegister ? this.formExport.value : null, UrlConstant.WORK_PLANNING_TEMPLATE.EXPORT + id).toPromise();
  }

  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 70
      },
      {
        title: 'kpi.workPlanningTemplates.table.name',
        field: 'name',
        width: 300
      },
      {
        title: 'kpi.indicatorConversions.table.createdTime',
        field: 'createdTime',
        width: 200
      },
      {
        title: 'kpi.indicatorConversions.table.createdBy',
        field: 'createdBy',
        width: 200
      },
      {
        title: 'kpi.indicatorConversions.table.modifiedTime',
        field: 'modifiedTime',
        width: 200
      },
      {
        title: 'kpi.indicatorConversions.table.modifiedBy',
        field: 'modifiedBy',
        width: 200
      },
      {
        title: ' ',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit
      }
    ];
  }
}

