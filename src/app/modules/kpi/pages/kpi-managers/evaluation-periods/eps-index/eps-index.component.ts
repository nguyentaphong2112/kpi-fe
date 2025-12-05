import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EvaluationPeriodsModel } from '../../../../data-access/models/kpi-managers/evaluation-periods.model';
import { EvaluationPeriodsService } from '../../../../data-access/services/kpi-managers/evaluation-periods.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { EpsFormComponent } from '@app/modules/kpi/pages/kpi-managers/evaluation-periods/eps-form/eps-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';

@Component({
  selector: 'app-eps-index',
  templateUrl: './eps-index.component.html',
  styleUrls: ['./eps-index.component.scss']
})


export class EpsIndexComponent extends BaseListComponent<EvaluationPeriodsModel> implements OnInit {
  functionCode = Constant.FUNCTION_CODE.EVALUATION_PERIODS;
  statusCodeList: NzSafeAny[] = [];


  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;
  constructor(
    injector: Injector,
    private readonly service: EvaluationPeriodsService,
    private readonly categoryService: CategoriesService
  ) {
    super(injector);
    this.initFormSearch();
    this.getDataSelect();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.formConfig = {
      title: 'kpi.evaluationPeriods.label.evaluationPeriod',
      content: EpsFormComponent
    };
    this.key = 'evaluationPeriodId';
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null]
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }

  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', Constant.CATEGORY.EVALUATION_PERIODS_STATUS))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.statusCodeList = res.data.map((item: NzSafeAny) => {
            item.color = '#06A561';
            item.bgColor = '#DAF9EC';
            return item;
          });
        }
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
          label: 'kpi.button.createList',
          icon: 'unordered-list',
          isShowFn: (evt: any) => evt.status === undefined,
          function: (evt: any) => {
            this.createList(evt.evaluationPeriodId);
          }
        }),
        // new ChildActionSchema({
        //   label: 'kpi.button.confirmData1',
        //   icon: 'check',
        //   isShowFn: (evt: any) => evt.status === Constant.STATUS.LAP_DANH_SACH,
        //   function: (evt: any) => {
        //     this.updateStatusById(evt.evaluationPeriodId, Constant.STATUS.CHOT_DU_LIEU1);
        //   }
        // }),
        // new ChildActionSchema({
        //   label: 'kpi.button.confirmData2',
        //   icon: 'check',
        //   isShowFn: (evt: any) => evt.status === Constant.STATUS.CHOT_DU_LIEU1,
        //   function: (evt: any) => {
        //     this.updateStatusById(evt.evaluationPeriodId, Constant.STATUS.CHOT_DU_LIEU2);
        //   }
        // }),
        // new ChildActionSchema({
        //   label: 'kpi.button.confirmResult',
        //   icon: 'check',
        //   isShowFn: (evt: any) => evt.status === Constant.STATUS.CHOT_DU_LIEU2,
        //   function: (evt: any) => {
        //     this.updateStatusById(evt.evaluationPeriodId, Constant.STATUS.CHOT_KET_QUA);
        //   }
        // }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteItem
        })
      ]
    });
  }


  createList(id: NzSafeAny) {
    this.service.createOrImport(null, REQUEST_TYPE.DEFAULT, UrlConstant.EVALUATION_PERIODS.INIT_DATA + id).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(
          this.translate.instant('kpi.notification.createListSuccess')
        );
        this.search();
      }
    });
  }

  updateStatusById(id: number, status: string) {
    this.service.update({
      id: id,
      status: status
    }, REQUEST_TYPE.FORM_DATA, UrlConstant.EVALUATION_PERIODS.STATUS).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      } else {
        this.toast.error(res.message);
      }
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
        width: 80
      },
      {
        title: 'kpi.evaluationPeriods.table.name',
        field: 'name',
        width: 300,
        thClassList: ['text-center']
      },
      {
        title: 'kpi.evaluationPeriods.table.evaluationTypeName',
        field: 'evaluationTypeName',
        width: 300,
        thClassList: ['text-center']
      },
      {
        title: 'kpi.evaluationPeriods.table.status',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.statusTmpl,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 200
      },
      {
        title: 'kpi.evaluationPeriods.table.year',
        field: 'year',
        width: 200,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'kpi.evaluationPeriods.table.startDate',
        field: 'startDate',
        width: 200,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'kpi.evaluationPeriods.table.endDate',
        field: 'endDate',
        width: 200,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'kpi.evaluationPeriods.table.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 200,
        show: false
      },
      {
        title: 'kpi.evaluationPeriods.table.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 200,
        show: false
      },
      {
        title: 'kpi.evaluationPeriods.table.modifiedTime',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 200,
        show: false
      },
      {
        title: 'kpi.evaluationPeriods.table.modifiedBy',
        field: 'modifiedBy',
        thClassList: ['text-center'],
        width: 200,
        show: false
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
  };
}

