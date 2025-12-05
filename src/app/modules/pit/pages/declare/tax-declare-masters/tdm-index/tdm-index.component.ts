import {Component, Injector, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TaxDeclareMastersModel} from '../../../../data-access/models/declare/tax-declare-masters.model';
import {TaxDeclareMastersService} from '../../../../data-access/services/declare/tax-declare-masters.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {ActionSchema, ChildActionSchema, ChildLevel2ActionSchema} from "@core/models/action.model";
import {Scopes} from "@core/utils/common-constants";
import {Validators} from "@angular/forms";
import {
  CalculateDeclareComponent
} from "@app/modules/pit/pages/declare/tax-declare-masters/calculate-declare/calculate-declare.component";
import {Constant} from "@app/modules/pit/data-access/constant/constant.class";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {CategoriesService} from "@app/modules/kpi/data-access/other-services/categories.service";
import {BehaviorSubject} from "rxjs";
import {format} from "date-fns";
import {UrlConstant} from "@app/modules/pit/data-access/constant/url.class";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";

@Component({
  selector: 'app-tdm-index',
  templateUrl: './tdm-index.component.html',
  styleUrls: ['./tdm-index.component.scss']
})


export class TdmIndexComponent extends BaseListComponent<TaxDeclareMastersModel> implements OnInit {
  serviceName = MICRO_SERVICE.PIT;
  urlLoadData = '/tax-declare-masters';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  isShowAdvSearch = false;
  visibleActionsCount = 0;
  actionSchema: ActionSchema;
  actionSchemaHeader: ActionSchema;
  @Input() scope: string = Scopes.VIEW;
  urlConstant = UrlConstant;
  statusCodes = Constant.TAX_DECLARE_MASTERS_STATUS;
  statusCodeList: NzSafeAny[] = [];
  taxPeriodDate$ = new BehaviorSubject<any>(null);
  exportActionSchema: ChildActionSchema[] = [];
  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;

  constructor(
    injector: Injector,
    private readonly service: TaxDeclareMastersService,
    private readonly categoryService: CategoriesService
  ) {
    super(injector);
    this.initFormSearch();
    this.getDataSelect();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.downLoadTemplateApi = () => {
      const taxPeriodDate = this.taxPeriodDate$.getValue();
      return this.service.downloadFile(`/download-template`, {taxPeriodDate});
    };
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, { fileName: fileName });
    this.lockApi = (id: number | string) => this.service.lockOrUnlockById(id.toString(), UrlConstant.TAX_DECLARE_MASTERS.LOCK);
    this.unlockApi = (id: number | string) => this.service.lockOrUnlockById(id.toString(), UrlConstant.TAX_DECLARE_MASTERS.UN_LOCK);
    this.serviceName = MICRO_SERVICE.PIT;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'taxDeclareMasterId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      fromPeriodDate: [null],
      toPeriodDate: [null],
      listStatus: [null],
    }, {
      validators:
        [DateValidator.validateRangeDate('fromPeriodDate', 'toPeriodDate', 'rangeDateError')]
    });
    this.initFormImport();
  }

  initFormImport() {
    this.formImport = this.fb.group({
      taxPeriodDate: [null, [Validators.required]],
      file: [null],
    });
  }


  get f() {
    return this.formImport.controls;
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      // el.list = this.list;
    });
  }

  override beforeExport() {
  }

  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', Constant.CATEGORY.TAX_DECLARE_MASTERS_STATUS))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.statusCodeList = res.data.map((item: NzSafeAny) => {
            if ([this.statusCodes.DU_THAO].includes(item.code)) {
              item.color = '#141ED2';
              item.bgColor = '#E9EAFF';
            } else {
              item.color = '#06A561';
              item.bgColor = '#DAF9EC';
            }
            return item;
          });
        }
      });
  }

  initExportActions(): ChildLevel2ActionSchema[] {
    return [
      new ChildLevel2ActionSchema({
        label: 'pit.taxDeclareMasters.export.detail',
        icon: 'file-excel',
        function: (data: any) => this.exportDetail(data?.taxDeclareMasterId)
      }),
      new ChildLevel2ActionSchema({
        label: 'pit.taxDeclareMasters.export.taxAllocation',
        icon: 'file-excel',
        function: (data: any) => this.exportTaxAllocation(data?.taxDeclareMasterId)
      }),
      new ChildLevel2ActionSchema({
        label: 'pit.taxDeclareMasters.export.xml',
        icon: 'file-excel',
        function: (data: any) => this.exportXML(data?.taxDeclareMasterId)
      }),
    ];
  }

  initAction() {
    this.exportActionSchema = this.initExportActions();
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.lock',
          icon: 'lock',
          disabled: (evt: any) => ['DA_CHOT'].includes(evt.status),
          function: this.lockItem
        }),
        new ChildActionSchema({
          label: 'common.button.unlock',
          icon: 'unlock',
          disabled: (evt: any) => ['DA_TINH_THUE', 'DU_THAO'].includes(evt.status),
          function: this.unlockItem
        }),
        new ChildActionSchema({
          label: 'common.button.export',
          icon: 'export',
          function: () => {}, // chức năng export cha
          children: this.exportActionSchema
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          function: this.deleteItem,
          disabled: (evt: any) => ['DA_CHOT', 'DA_TINH_THUE'].includes(evt.status),
        })
      ]
    });

    this.visibleActionsCount = this.actionSchemaHeader.arrAction.filter(it => it.isShow && it.isShowFn?.()).length;
  }


  // Các phương thức hành động
  exportDetail(taxDeclareMasterId: string) {
    this.service.exportDetail(taxDeclareMasterId).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }

  exportXML(taxDeclareMasterId: string) {
    this.service.exportXML(taxDeclareMasterId).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }

  exportTaxAllocation(taxDeclareMasterId: string) {
    this.service.exportTaxAllocation(taxDeclareMasterId).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
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
          title: 'pit.taxDeclareMasters.table.taxPeriodDate',
          field: 'taxPeriodDate',
          width: 80,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxDeclareMasters.table.status',
          width: 120,
          fieldType: 'tdTemplate',
          fieldTypeValue: this.statusTmpl,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxDeclareMasters.table.totalIncomeTaxable',
          field: 'totalIncomeTaxable',
          width: 120,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
        {
          title: 'pit.taxDeclareMasters.table.totalIncomeFreeTax',
          field: 'totalIncomeFreeTax',
          width: 120,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
        {
          title: 'pit.taxDeclareMasters.table.totalInsuranceDeduction',
          field: 'totalInsuranceDeduction',
          width: 120,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
        {
          title: 'pit.taxDeclareMasters.table.totalIncomeTax',
          field: 'totalIncomeTax',
          width: 120,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
        {
          title: 'pit.taxDeclareMasters.table.totalTaxCollected',
          field: 'totalTaxCollected',
          width: 120,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
        {
          title: 'pit.taxDeclareMasters.table.totalTaxPayable',
          field: 'totalTaxPayable',
          width: 120,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
        {
          title: 'pit.taxDeclareMasters.table.totalMonthRetroTax',
          field: 'totalMonthRetroTax',
          width: 120,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
        {
          title: 'pit.taxDeclareMasters.table.inputType',
          field: 'inputType',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxDeclareMasters.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'pit.taxDeclareMasters.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxDeclareMasters.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'pit.taxDeclareMasters.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
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
          show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
        }
      ]
    };

  onChangeTaxPeriodDate(event: any) {
    this.taxPeriodDate$.next(format(event, 'dd/MM/yyyy'));
  }

  openModal(data?: any) {
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzTitle: this.translate.instant('pit.taxDeclareMasters.titleDeclare'),
      nzContent: CalculateDeclareComponent,
      nzComponentParams: {
        data
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.search(this.pagination.pageNumber);
          this.afterRefresh();
        }
      }
    );

  }

  protected readonly Mode = Mode;
}

