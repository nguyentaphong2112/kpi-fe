import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import {
  IndicatorConversionsService
} from '@app/modules/kpi/data-access/services/kpi-managers/indicator-conversions.service';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import {
  IcsAddFormComponent
} from '@app/modules/kpi/pages/kpi-managers/indicator-conversions/ics-add-form/ics-add-form.component';
import { CategoriesService } from '@app/modules/admin/data-access/services/categories/categories.service';
import { CatalogModel } from '@shared/model/catalog-model';
import { Mode, REQUEST_TYPE, TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { CommonUtils } from '@shared/services/common-utils.service';

@Component({
  selector: 'app-ics-add',
  templateUrl: './ics-add.component.html',
  styleUrls: ['./ics-add.component.scss']
})
export class IcsAddComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  listConversion: CatalogModel[] = [];
  functionCode = Constant.FUNCTION_CODE.INDICATOR_CONVERSION;
  jobName = '';
  orgTypeName = '';
  organizationName = '';
  urlApiImport = '';
  orgId = null;
  statusCodeList: NzSafeAny[] = [];
  statusCodes = Constant.INDICATOR_CONVERSION_STATUS;
  isDetail = false;

  @ViewChild('noteTpl', { static: true }) noteTpl!: TemplateRef<any>;
  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;

  constructor(
    injector: Injector,
    private categoryService: CategoriesService,
    private readonly service: IndicatorConversionsService
  ) {
    super(injector);
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template/' + this.route.snapshot.queryParams.indicatorMasterId + '/' + this.route.snapshot.queryParams?.organizationId);
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, this.urlApiImport);
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, { fileName: fileName });
    this.formConfig = {
      title: 'kpi.indicatorConversions.label.title',
      content: IcsAddFormComponent
    };
    this.orgId = this.route.snapshot.queryParams?.organizationId;
    this.isDetail = this.route.snapshot.queryParams?.isDetail;
    this.key = 'indicatorConversionId';
  }

  ngOnInit() {
    this.initConversion();
    this.getName();
    super.ngOnInit();
    this.initAction();
    this.urlApiImport = '/import/' + this.route.snapshot.queryParams.indicatorMasterId;
  }

  getName() {
    this.service.getList(this.route.snapshot.queryParams, UrlConstant.INDICATOR_CONVERSION.INDICATOR).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.orgTypeName = res.data.orgTypeName;
        this.jobName = res.data.jobName;
        this.organizationName = res.data.organizationName;
      }
    });
  }

  override search(page?: number) {
    this.pagination.pageNumber = page ?? 1;
    this.service.getFilterResearch(this.route.snapshot.queryParams, this.pagination.getCurrentPage(), UrlConstant.INDICATOR_CONVERSION.GET_TABLE).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        res.data.listData.forEach((item) => {
          item.conversions.forEach((conversion) => {
            item[conversion.resultId] = conversion.expression;
          });
        });
        this.tableData = res.data.listData;
        this.tableConfig.total = res.data.total;
        this.tableConfig.pageIndex = res.data.pageIndex;
      }
    });
  }

  updateStatus(type: string, id: number) {
    this.service.createOrImport({
      status: type
    }, REQUEST_TYPE.DEFAULT, UrlConstant.INDICATOR_CONVERSION.STATUS + '/' + id).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }


  initConversion() {
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
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_THANG_DO)).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listConversion = res.data;
        this.setHeaders();
      }
    });
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.detail',
          icon: 'eye',
          isShow: this.objFunction?.view,
          function: (evt: any) => {
            this.doOpenForm(Mode.VIEW, { ...evt, orgId: this.orgId });
          }
        }),
        new ChildActionSchema({
          label: 'common.button.adjust',
          icon: 'setting',
          isShowFn: (evt: any) => evt.status === Constant.STATUS.PHE_DUYET,
          function: (evt: any) => {
            this.doOpenForm(Mode.EDIT, { ...evt, orgId: this.orgId });
          }
        }),
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShowFn: (evt: any) => ![Constant.STATUS.PHE_DUYET, Constant.STATUS.HET_HIEU_LUC].includes(evt.status) && this.objFunction?.edit,
          function: (evt: any) => {
            this.doOpenForm(Mode.EDIT, { ...evt, orgId: this.orgId });
          }
        }),
        new ChildActionSchema({
          label: 'common.button.rejectApprove',
          icon: 'close',
          isShowFn: (evt: any) => [Constant.STATUS.CHO_PHE_DUYET, Constant.STATUS.DE_NGHI_XOA, Constant.STATUS.CHO_PHE_DUYET_HIEU_LUC_LAI].includes(evt.status) && this.objFunction.approve,
          function: (evt: any) => {
            this.updateStatus(Constant.STATUS.TU_CHOI_PHE_DUYET, evt.indicatorConversionId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.validityAgain',
          icon: 'check',
          isShowFn: (evt: any) => [Constant.STATUS.HET_HIEU_LUC].includes(evt.status),
          function: (evt: any) => {
            this.updateStatus(Constant.STATUS.CHO_PHE_DUYET_HIEU_LUC_LAI, evt.indicatorConversionId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.requestDelete',
          icon: 'delete',
          isShowFn: (evt: any) => [Constant.STATUS.PHE_DUYET].includes(evt.status) && this.objFunction?.delete,
          function: (evt: any) => {
            this.updateStatus(Constant.STATUS.DE_NGHI_XOA, evt.indicatorConversionId);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShowFn: (evt: any) => [Constant.STATUS.CHO_PHE_DUYET].includes(evt.status) && this.objFunction?.delete,
          function: this.deleteItem
        })
      ]
    });
  }

  onClickItem(data: any) {
    if (![Constant.STATUS.PHE_DUYET, Constant.STATUS.HET_HIEU_LUC].includes(data.status)) {
      this.doOpenForm(Mode.EDIT, { ...data, orgId: this.orgId });
    } else {
      this.doOpenForm(Mode.VIEW, { ...data, orgId: this.orgId });
    }
  }

  override setHeaders() {
    this.tableConfig = {
      headers: [
        {
          title: 'STT',
          thClassList: ['text-center'],
          tdClassList: ['text-center'],
          fixed: true,
          fixedDir: 'left',
          width: 50,
          rowspan: 2
        },

        {
          title: 'kpi.indicatorConversions.table.name',
          field: 'indicatorName',
          thClassList: ['text-center'],
          fixedDir: 'left',
          rowspan: 2,
          width: 300
        },
        {
          title: 'kpi.indicatorConversions.table.unitId',
          field: 'unitName',
          rowspan: 2,
          tdClassList: ['text-center'],
          width: 150
        },
        {
          title: 'kpi.indicatorConversions.table.periodType',
          field: 'periodTypeName',
          rowspan: 2,
          tdClassList: ['text-center'],
          width: 150
        },
        {
          title: 'kpi.indicatorConversions.label.isRequired',
          field: 'isRequiredName',
          rowspan: 2,
          tdClassList: ['text-center'],
          width: 150
        },
        {
          title: 'kpi.indicatorConversions.table.scaleInterpretation',
          width: this.listConversion.length * 100,
          colspan: this.listConversion.length,
          rowspan: this.listConversion.length > 0 ? 1 : 2,
          child: this.getHeader()
        },
        {
          title: 'kpi.indicatorConversions.table.status',
          fieldType: 'tdTemplate',
          fieldTypeValue: this.statusTmpl,
          tdClassList: ['text-center'],
          rowspan: 2,
          width: 200
        },
        {
          title: 'kpi.indicatorConversions.table.note',
          fieldType: 'tdTemplate',
          fieldTypeValue: this.noteTpl,
          rowspan: 2,
          width: 200
        },
        {
          title: ' ',
          tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
          width: 80,
          field: 'action',
          rowspan: 2,
          fieldType: 'tdTemplate',
          fieldTypeValue: this.actionTpl,
          fixed: true,
          fixedDir: 'right',
          show: !this.isDetail
        }
      ],
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1,
      showFrontPagination: false
    };
  }

  getHeader() {
    const listHeader: HBTTableHeader[] = [];
    this.listConversion.forEach((column: any) => {
      const header: HBTTableHeader = {
        title: column.name,
        field: column.value,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 100
      };
      listHeader.push(header);
    });
    return listHeader;
  }

  strReplaceSpace(str: any) {
    return str.replace(/\s/g, ' ');
  }

  override back() {
    CommonUtils.setFormSearchToLocalStorageByName("ics-add", true);
    super.back();
  }
}
