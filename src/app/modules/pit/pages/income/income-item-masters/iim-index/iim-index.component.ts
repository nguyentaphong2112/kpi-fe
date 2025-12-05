import {Component, Injector, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {IncomeItemMastersModel} from '../../../../data-access/models/income/income-item-masters.model';
import {IncomeItemMastersService} from '../../../../data-access/services/income/income-item-masters.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {Scopes} from "@core/utils/common-constants";
import {Validators} from "@angular/forms";
import {IisFormComponent} from "@app/modules/pit/pages/income/income-items/iis-form/iis-form.component";
import {format} from "date-fns";
import {IncomeItemsService} from "@app/modules/pit/data-access/services/income/income-items.service";
import {CategoryModel} from "@core/models/category-common.interface";
import {BehaviorSubject} from "rxjs";
import {UrlConstant} from "@app/modules/pit/data-access/constant/url.class";
import {Constant} from "@app/modules/pit/data-access/constant/constant.class";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {CategoriesService} from "@app/modules/kpi/data-access/other-services/categories.service";

@Component({
  selector: 'app-iim-index',
  templateUrl: './iim-index.component.html',
  styleUrls: ['./iim-index.component.scss']
})


export class IimIndexComponent extends BaseListComponent<IncomeItemMastersModel> implements OnInit {
  serviceName = MICRO_SERVICE.PIT;
  urlLoadData = '/income-item-masters';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', {static: true}) attachFile!: TemplateRef<any>;
  isShowAdvSearch = false;
  visibleActionsCount = 0;
  actionSchemaHeader: ActionSchema;
  @Input() scope: string = Scopes.VIEW;
  urlConstant = UrlConstant;
  listIncome: CategoryModel[] = [];
  incomeItemId$ = new BehaviorSubject<any>(null);
  statusCodes = Constant.INCOME_ITEM_MASTER;
  statusCodeList: NzSafeAny[] = [];
  @ViewChild('statusTmpl', {static: true}) statusTmpl!: TemplateRef<NzSafeAny>;

  constructor(
    injector: Injector,
    private readonly service: IncomeItemMastersService,
    private readonly serviceIncomeItem: IncomeItemsService,
    private readonly categoryService: CategoriesService
  ) {
    super(injector)
    this.initFormSearch();
    this.getDataSelect();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.downLoadTemplateApi = () => {
      const id = this.incomeItemId$.getValue();
      return this.serviceIncomeItem.downloadFile(`/download-template/${id}`);
    };
    this.lockApi = (id: number | string) => this.service.lockOrUnlockById(id.toString(), UrlConstant.INCOME_ITEM_MASTERS.LOCK);
    this.unlockApi = (id: number | string) => this.service.lockOrUnlockById(id.toString(), UrlConstant.INCOME_ITEM_MASTERS.UN_LOCK);
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, {fileName: fileName});
    this.serviceName = MICRO_SERVICE.PIT;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'incomeItemMasterId';
  }

  initFormSearch() {
    this.form = this.fb.group({
      listType: [null],
      taxPeriodDate: [null],
      incomeName: [null],
      listStatus: [null],
    });
    this.formImport = this.fb.group({
      salaryPeriodDate: [null, [Validators.required]],
      incomeItemId: [null, [Validators.required]],
      taxPeriodDate: [null, [Validators.required]],
      isCalculated: [null],
      fileImport: [null],
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  afterCloseImport() {
    super.afterCloseImport();
    this.formImport.reset();
  }

  openModal(mode: Mode, data?: any) {
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzTitle: this.translate.instant('common.title.add') + ' ' + this.translate.instant('pit.incomeItemMasters.table.import.income'),
      nzContent: IisFormComponent,
      nzComponentParams: {
        mode,
        data
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => result?.refresh);
  }


  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', Constant.CATEGORY.PIT_TRANG_THAI_TNCN))
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
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.lock',
          icon: 'lock',
          // isShow: this.objFunction?.edit,
          disabled: (evt: any) => ['DA_CHOT', 'DA_KE_KHAI'].includes(evt.status),
          function: this.lockItem
        }),
        new ChildActionSchema({
          label: 'common.button.unlock',
          icon: 'unlock',
          // isShow: this.objFunction?.edit,
          disabled: (evt: any) => ['DA_TINH_THUE', 'DU_THAO', 'DA_KE_KHAI'].includes(evt.status),
          function: this.unlockItem
        }),
        new ChildActionSchema({
          label: 'pit.taxDeclareMasters.button.calTax',
          icon: 'calculator',
          disabled: (evt: any) => ['DA_CHOT', 'DA_KE_KHAI', 'DA_TINH_THUE'].includes(evt.status),
          function: (data) => {
            this.onCalTax(data[this.key]);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.download',
          icon: 'download',
          isShow: true,
          function: (data) => {
            this.onDownloadFile(data[this.key]);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          function: this.deleteItem,
          disabled: (evt: any) => ['DA_CHOT', 'DA_KE_KHAI', 'DA_TINH_THUE'].includes(evt.status),
        })
      ]
    });
    this.visibleActionsCount = this.actionSchemaHeader.arrAction.filter(it => it.isShow && it.isShowFn).length;
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

  onDownloadFile(id: any) {
    this.params = {
      isPreview: 1,
    }
    this.subscriptions.push(
      this.service.downloadFileIncome(id, this.params).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(
            this.translate.instant('common.notification.addSuccess')
          );
        }
      })
    );
  }

  onCalTax(resData: any) {
    if (this.formImport.get('isCalculated').value === 'N') {
      this.subscriptions.push(
        this.service.calTax(resData.data).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toast.success(this.translate.instant('common.notification.taxSuccess'));
            this.search(1);
          }
        })
      );
    }
  }

  override doCloseImport(isSearch: boolean) {
    this.isImportData = false;
    this.isSubmittedImport = false;
    this.afterCloseImport();
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
        width: 50,
      },
      {
        title: 'pit.incomeItemMasters.table.itemName',
        field: 'itemName',
        width: 400,
        thFilter: true,
      },
      {
        title: 'pit.incomeItemMasters.table.typeName',
        field: 'typeName',
        width: 100,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'pit.incomeItemMasters.table.itemCode',
        field: 'itemCode',
        width: 100,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'pit.incomeItemMasters.table.taxPeriodDate',
        field: 'taxPeriodDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'pit.incomeItemMasters.table.status',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.statusTmpl,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 150,
      },
      {
        title: 'pit.incomeItemMasters.table.totalIncome',
        field: 'totalIncome',
        width: 120,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'pit.incomeItemMasters.table.totalInsuranceDeduction',
        field: 'totalInsuranceDeduction',
        width: 120,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'pit.incomeItemMasters.table.totalIncomeTaxable',
        field: 'totalIncomeTaxable',
        width: 120,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'pit.incomeItemMasters.table.totalIncomeFreeTax',
        field: 'totalIncomeFreeTax',
        width: 120,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'pit.incomeItemMasters.table.totalIncomeTax',
        field: 'totalIncomeTax',
        width: 120,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'pit.incomeItemMasters.table.totalMonthRetroTax',
        field: 'totalMonthRetroTax',
        width: 120,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'pit.incomeItemMasters.table.totalYearRetroTax',
        field: 'totalYearRetroTax',
        width: 120,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'pit.incomeItemMasters.table.totalReceived',
        field: 'totalReceived',
        width: 120,
        tdClassList: ['text-right'],
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        thFilter: true,
        filterType: 'number'
      },
      {
        title: 'pit.incomeItemMasters.table.taxCalBy',
        field: 'taxCalBy',
        width: 120,
      },
      {
        title: 'pit.incomeItemMasters.table.taxDate',
        field: 'taxDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'pit.incomeItemMasters.table.createdBy',
        field: 'createdBy',
        width: 120,
        show: false,
      },
      {
        title: 'pit.incomeItemMasters.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'pit.incomeItemMasters.table.modifiedBy',
        field: 'modifiedBy',
        width: 120,
        show: false,
      },
      {
        title: 'pit.incomeItemMasters.table.modifiedTime',
        field: 'modifiedTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'common.label.attachFile',
        field: 'attachFileList',
        width: 250,
        show: false,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.attachFile
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

  onChangeSalaryPeriodDate(event: any) {
    this.formImport.controls.incomeItemId.setValue(null);
    this.serviceIncomeItem.getIncomeItemByPeriod({
      salaryPeriodDate: format(event, 'dd/MM/yyyy'),
      isImport: 'N'
    }).subscribe((res: any) => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listIncome = res.data;
        this.ref.detectChanges();
      }
    })
  }

  onChangeIncome(event: any) {
    this.incomeItemId$.next(event);
  }


  protected readonly Mode = Mode;
}

