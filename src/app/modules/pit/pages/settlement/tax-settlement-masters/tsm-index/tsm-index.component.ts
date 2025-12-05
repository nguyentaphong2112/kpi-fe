import {Component, Injector, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TaxSettlementMastersModel} from '../../../../data-access/models/settlement/tax-settlement-masters.model';
import {TaxSettlementMastersService} from '../../../../data-access/services/settlement/tax-settlement-masters.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {ActionSchema, ChildActionSchema, ChildLevel2ActionSchema} from "@core/models/action.model";
import {Scopes} from "@core/utils/common-constants";
import {CatalogModel} from "@shared/model/catalog-model";
import {Validators} from "@angular/forms";
import {
  TaxSettlementMastersSyntheticComponent
} from "@app/modules/pit/pages/settlement/tax-settlement-masters/tax-settlement-masters-synthetic/tax-settlement-masters-synthetic.component";
import {TsmFormComponent} from "@app/modules/pit/pages/settlement/tax-settlement-masters/tsm-form/tsm-form.component";
import {UrlConstant} from "@app/modules/pit/data-access/constant/url.class";
import {Constant} from "@app/modules/pit/data-access/constant/constant.class";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {CategoriesService} from "@app/modules/kpi/data-access/other-services/categories.service";

@Component({
  selector: 'app-tsm-index',
  templateUrl: './tsm-index.component.html',
  styleUrls: ['./tsm-index.component.scss']
})


export class TsmIndexComponent extends BaseListComponent<TaxSettlementMastersModel> implements OnInit {
  serviceName = MICRO_SERVICE.PIT;
  urlLoadData = '/tax-settlement-masters';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  isShowAdvSearch = false;
  visibleActionsCount = 0;
  actionSchemaHeader: ActionSchema;
  statusCodes = Constant.TAX_SETTLEMENT_MASTERS;
  @Input() scope: string = Scopes.VIEW;
  urlConstant = UrlConstant;
  listYear: CatalogModel[] = [];
  exportActionSchema: ChildActionSchema[] = [];
  statusCodeList: NzSafeAny[] = [];
  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;

  constructor(
    injector: Injector,
    private readonly service: TaxSettlementMastersService,
    private readonly categoryService: CategoriesService
  ) {
    super(injector);
    this.initFormSearch();
    this.getDataSelect();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, { fileName: fileName });
    this.lockApi = (id: number | string) => this.service.lockOrUnlockById(id.toString(), UrlConstant.TAX_SETTLEMENT_MASTERS.LOCK);
    this.unlockApi = (id: number | string) => this.service.lockOrUnlockById(id.toString(), UrlConstant.TAX_SETTLEMENT_MASTERS.UN_LOCK);

    this.serviceName = MICRO_SERVICE.PIT;
    this.key = 'taxSettlementMasterId';

    this.formConfig = {
      title: 'pit.taxSettlement.title',
      content: TsmFormComponent
    };
  }

  initFormSearch() {
    this.form = this.fb.group({
      year: [null],
    });
    this.initFormImport();
  }
  ngOnInit() {
    super.ngOnInit();
    this.listYear = this.getYearList();
    this.initAction();
  }

  initFormImport() {
    this.formImport = this.fb.group({
      taxPeriodDate: [null, [Validators.required]],
      file: [null],
    });
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

  onChangeYear() {
    this.search();
  }

  afterCloseImport() {
    this.formImport.reset();
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

  initAction() {
    this.exportActionSchema = this.initExportActions();
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.lock',
          icon: 'lock',
          // isShow: this.objFunction?.edit,
          disabled: (evt: any) => {
            return ['DA_CHOT'].includes(evt.status);
          },
          function: this.lockItem
        }),
        new ChildActionSchema({
          label: 'common.button.unlock',
          icon: 'unlock',
          disabled: (evt: any) => {
            return ['DA_TINH_THUE', 'DU_THAO'].includes(evt.status);
          },
          function: this.unlockItem
        }),
        new ChildActionSchema({
          label: 'common.button.export',
          icon: 'export',
          isShow: true,
          function: () => {},
          children: this.exportActionSchema
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          function: this.deleteItem
        })
      ]
    });
    this.visibleActionsCount = this.actionSchemaHeader.arrAction.filter(it => it.isShow && it.isShowFn).length;
  }

  initExportActions(): ChildLevel2ActionSchema[] {
    return [
      new ChildLevel2ActionSchema({
        label: 'pit.taxSettlement.export.detail',
        icon: 'file-excel',
        function: (data: any) => this.exportDetail(data?.taxSettlementMasterId)
      }),
      new ChildLevel2ActionSchema({
        label: 'pit.taxSettlement.export.group',
        icon: 'file-excel',
        function: (data: any) => this.exportGroup(data?.taxSettlementMasterId)
      }),
      new ChildLevel2ActionSchema({
        label: 'pit.taxSettlement.export.month',
        icon: 'file-excel',
        function: (data: any) => this.exportMonth(data?.taxSettlementMasterId)
      }),
    ];
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

  exportGroup(taxDeclareMasterId: string) {
    this.service.exportGroup(taxDeclareMasterId).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }

  exportMonth(taxDeclareMasterId: string) {
    this.service.exportMonth(taxDeclareMasterId).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }

  get f() {
    return this.formImport.controls;
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
        width: 30
      },
        {
          title: 'pit.taxSettlement.table.year',
          field: 'year',
          width: 50,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxSettlement.table.status',
          fieldType: 'tdTemplate',
          fieldTypeValue: this.statusTmpl,
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxSettlement.table.inputType',
          field: 'inputType',
          width: 100,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxSettlement.table.totalIncomeTaxable',
          field: 'totalIncomeTaxable',
          width: 120,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
        {
          title: 'pit.taxSettlement.table.totalDeduction',
          field: 'totalDeduction',
          width: 140,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
        {
          title: 'pit.taxDeclare.table.totalTaxCollected',
          field: 'totalTaxCollected',
          width: 120,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
      {
          title: 'pit.taxDeclare.table.totalTaxPayable',
          field: 'totalTaxPayable',
          width: 120,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
        {
          title: 'pit.taxSettlement.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'pit.taxSettlement.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxSettlement.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'pit.taxSettlement.table.modifiedTime',
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
          width: 30,
          fieldType: 'tdTemplate',
          fieldTypeValue: this.actionTpl,
          fixed: window.innerWidth > 1024,
          fixedDir: 'right',
          show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
        }
      ]
    };

    getYearList() {
      const listYear = [];
      const currentYear = new Date().getFullYear();
      for (let i = currentYear - 50; i <= currentYear + 50; i++) {
        listYear.push(new CatalogModel(i.toString(), i));
      }
      return listYear;
    }

    openModal(data?: any) {
      this.modalRef = this.modal.create({
        nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
        nzTitle: this.translate.instant('pit.taxSettlement.titleSynthetic'),
        nzContent: TaxSettlementMastersSyntheticComponent,
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
}

