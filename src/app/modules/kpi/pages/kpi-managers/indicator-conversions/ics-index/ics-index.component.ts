import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  IndicatorConversionsService
} from '../../../../data-access/services/kpi-managers/indicator-conversions.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import {
  IcsFormComponent
} from '@app/modules/kpi/pages/kpi-managers/indicator-conversions/ics-form/ics-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { BaseResponse } from '@core/models/base-response';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { REQUEST_TYPE } from '@shared/constant/common';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import { Scopes } from '@core/utils/common-constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { ObjectUtil } from '@core/utils/object.util';
import { IndicatorMasterService } from '@app/modules/kpi/data-access/services/kpi-managers/indicator-master.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Validators } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged, Subscription, take } from 'rxjs';
import { NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-ics-index',
  templateUrl: './ics-index.component.html',
  styleUrls: ['./ics-index.component.scss']
})


export class IcsIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = Constant.FUNCTION_CODE.INDICATOR_CONVERSION;
  serviceName = MICRO_SERVICE.HRM;
  urlLoadData = UrlConstant.JOBS.VI_TRI_VIEC_LAM;
  isShowAdvSearch = false;
  statusCodeList: NzSafeAny[] = [];
  scope = Scopes.VIEW;
  statusCodes = Constant.INDICATOR_CONVERSION_STATUS;
  levelList: CategoryModel[] = [];
  actionSchemaHeader: ActionSchema;
  visibleActionsCount = 0;
  nzWidth: number;
  listConversionValue = ObjectUtil.optionsToList(Constant.CONVERSION_VALUE2, this.translate);
  isValueSelected = true;

  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;

  constructor(
    injector: Injector,
    private readonly categoryService: CategoriesService,
    private readonly service: IndicatorConversionsService,
    private readonly masterService: IndicatorMasterService
  ) {
    super(injector);
    this.nameLocalSearch = 'search-indicator-conversion';
    this.nameLocalForm = 'ics-add';
    this.initFormSearch();
    this.getDataSelect();
    this.deleteApi = (id: number | string) => this.masterService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.masterService.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.masterService.export(CommonUtils.convertDataSendToServer(body, true));
    this.downLoadTemplateApi = () => this.masterService.downloadFile('/download-template', this.formImport.value);
    this.importApi = (body) => this.masterService.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.masterService.downloadFileByName(url, { fileName: fileName });
    this.formConfig = {
      title: 'kpi.indicatorConversions.label.indicatorConversion',
      content: IcsFormComponent
    };
    this.key = 'indicatorConversionId';
    this.nzWidth = window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5;
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', Constant.CATEGORY.INDICATOR_CONVERSION_STATUS))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.statusCodeList = res.data.map((item: NzSafeAny) => {
            if ([this.statusCodes.DE_NGHI_XOA, this.statusCodes.CHO_PHE_DUYET, this.statusCodes.CHO_PHE_DUYET_HIEU_LUC_LAI].includes(item.code)) {
              item.color = '#F99600';
              item.bgColor = '#FFF2DA';
            } else if ([this.statusCodes.TU_CHOI_PHE_DUYET, this.statusCodes.HET_HIEU_LUC].includes(item.code)) {
              item.color = '#FA0B0B';
              item.bgColor = '#FDE7EA';
            } else {
              item.color = '#06A561';
              item.bgColor = '#DAF9EC';
            }
            return item;
          });
        }
      });
    this.levelList = ObjectUtil.optionsToList(Constant.LEVEL_VALUE, this.translate);
  }


  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null,
      orgTypeId: null,
      jobId: null,
      organizationId: null,
      level: null
    });

    this.initFormImport();
  }


  initFormImport() {
    this.formImport = this.fb.group({
      orgTypeId: [null],
      organizationId: [1, [Validators.required]],
      jobId: [null],
      orgManageId: [1, [Validators.required]],
      type: ['ORG', Validators.required],
      managerJobId: [null]
    });
  }


  changeInput($event) {
    this.isValueSelected = $event === 'ORG';
    if (this.isValueSelected) {
      this.formImport.controls['jobId'].setValue(null);
      this.formImport.controls['jobId'].clearValidators();
      this.formImport.controls['jobId'].updateValueAndValidity();
      this.formImport.controls['managerJobId'].setValidators(Validators.required);
      this.formImport.controls['managerJobId'].updateValueAndValidity();
    } else {
      this.formImport.controls['managerJobId'].setValue(null);
      this.formImport.controls['managerJobId'].clearValidators();
      this.formImport.controls['managerJobId'].updateValueAndValidity();
      this.formImport.controls['jobId'].setValidators(Validators.required);
      this.formImport.controls['jobId'].updateValueAndValidity();
    }
  }

  initAction() {
    this.actionSchemaHeader = new ActionSchema({
      arrAction: [new ChildActionSchema({
        label: 'common.button.approvedAll',
        icon: 'check',
        isShow: this.objFunction.approve,
        function: () => {
          this.approvalAll();
        }
      }),
        new ChildActionSchema({
          label: 'common.button.export',
          icon: 'export',
          isShow: true,
          function: () => {
            this.export();
          }
        })
      ]
    });
    this.visibleActionsCount = this.actionSchemaHeader.arrAction.filter(it => it.isShow && it.isShowFn).length;
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction.edit,
          function: (evt: any) => {
            this.navigateEdit(evt.indicatorMasterId, evt.orgTypeId, evt.organizationId, evt.jobId, evt.status);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.export',
          icon: 'export',
          isShow: true,
          function: (evt: any) => {
            this.exportById(evt.indicatorMasterId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.approve',
          icon: 'check',
          isShowFn: (evt: any) => [Constant.STATUS.CHO_PHE_DUYET, Constant.STATUS.DE_NGHI_XOA, Constant.STATUS.CHO_PHE_DUYET_HIEU_LUC_LAI].includes(evt.status) && this.objFunction.approve,
          function: (evt: any) => {
            this.updateStatus(Constant.STATUS.PHE_DUYET, evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.rejectApprove',
          icon: 'close',
          isShowFn: (evt: any) => [Constant.STATUS.CHO_PHE_DUYET, Constant.STATUS.DE_NGHI_XOA, Constant.STATUS.CHO_PHE_DUYET_HIEU_LUC_LAI].includes(evt.status) && this.objFunction.approve,
          function: (evt: any) => {
            this.updateStatus(Constant.STATUS.TU_CHOI_PHE_DUYET, evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.validityAgain',
          icon: 'check',
          isShowFn: (evt: any) => [Constant.STATUS.HET_HIEU_LUC].includes(evt.status),
          function: (evt: any) => {
            this.updateStatus(Constant.STATUS.CHO_PHE_DUYET_HIEU_LUC_LAI, evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.requestDelete',
          icon: 'delete',
          isShowFn: (evt: any) => [Constant.STATUS.PHE_DUYET].includes(evt.status) && this.objFunction?.delete,
          function: (evt: any) => {
            this.updateStatus(Constant.STATUS.DE_NGHI_XOA, evt);
          }
        })
      ]
    });
  }

  updateStatus(type: string, data: NzSafeAny) {
    this.masterService.createOrImport({
      ...data,
      status: type
    }, REQUEST_TYPE.DEFAULT, UrlConstant.INDICATOR_MASTER.STATUS).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }

  approvalAll() {
    this.masterService.createOrImport(null, REQUEST_TYPE.DEFAULT, UrlConstant.INDICATOR_MASTER.APPROVAL_ALL).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.isApproveAll'));
        this.search();
      }
    });
  }

  exportById(id: number) {
    this.masterService.export(null, '/export/' + id).toPromise();
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
        title: 'kpi.indicatorConversions.table.organizationName',
        field: 'organizationName',
        width: 300,
        thClassList: ['text-center']
      },
      {
        title: 'kpi.indicatorConversions.table.scope',
        field: 'scope',
        width: 300,
        thClassList: ['text-center']
      },
      {
        title: 'kpi.indicatorConversions.table.level',
        field: 'kpiLevelName',
        width: 100,
        thClassList: ['text-center'],
        tdClassList: ['text-center']
      },
      {
        title: 'kpi.indicatorConversions.table.status',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.statusTmpl,
        width: 200,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'kpi.indicatorConversions.table.createdTime',
        field: 'createdTime',
        width: 150
      },
      {
        title: 'kpi.indicatorConversions.table.createdBy',
        field: 'createdBy',
        width: 150
      },
      {
        title: 'kpi.indicatorConversions.table.modifiedTime',
        field: 'modifiedTime',
        width: 150
      },
      {
        title: 'kpi.indicatorConversions.table.modifiedBy',
        field: 'modifiedBy',
        width: 150
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 80,
        field: 'action',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }

  navigateEdit(indicatorMasterId?: number, orgTypeId?: number, organizationId?: string, jobId?: number, status?: string) {
    this.router.navigate(['/kpi/kpi-managers/indicator-conversions/add-indicator-conversions'],
      { queryParams: { indicatorMasterId, orgTypeId, organizationId, jobId, status } });
  }

  deleteData(orgTypeId?: any, organizationId?: string, jobId?: any) {
    this.popupService.showModalConfirmDelete(() => {
      if (jobId) {
        this.service.deleteById(jobId, '/orgType/' + orgTypeId + '/' + organizationId)
          .subscribe((res: BaseResponse<any>) => {
              if (res.code === HTTP_STATUS_CODE.SUCCESS) {
                this.toast.success(
                  this.translate.instant('common.notification.deleteSuccess')
                );
                this.search();
              }
            }
          );
      } else {
        this.service.deleteById(organizationId, '/orgType/' + orgTypeId)
          .subscribe((res: BaseResponse<any>) => {
              if (res.code === HTTP_STATUS_CODE.SUCCESS) {
                this.toast.success(
                  this.translate.instant('common.notification.deleteSuccess')
                );
                this.search();
              }
            }
          );
      }
    });
  }

}

